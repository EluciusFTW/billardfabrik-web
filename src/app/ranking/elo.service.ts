import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, firstValueFrom, map } from 'rxjs';
import { EloFunctions } from '../tourney-series/services/evaluation/elo-functions';
import { RankingPlayer } from './models/ranking-player';
import { EloPlayer } from './models/elo-player';
import { IncomingMatch, RankingMatch } from './models/ranking-match';

const DB_MATCHES_LPATH = 'elo/rankedmatches';
export const DB_INCOMING_MATCHES_LPATH = 'elo/incomingmatches';
export const DB_NEW_PLAYERS_PATH = 'elo/playersV2';

type FBase = { key: string }
type Db<T> = T & FBase;

@Injectable()
export class EloService {
  private readonly lowerBoundOnGames = 10;

  constructor(private db: AngularFireDatabase) { }

  GetRanking(): Observable<RankingPlayer[]> {
    return this.db
      .list<EloPlayer>(
        DB_NEW_PLAYERS_PATH,
        ref => ref
          .orderByChild('show')
          .equalTo(true))
      .snapshotChanges()
      .pipe(map(snapshots => snapshots
        .map(item => item.payload)
        .filter(item => item.val().changes.length > this.lowerBoundOnGames)
        .map(player => ({
          name: this.nameFromKey(player.key),
          allScores: player
            .val().changes
            .map(match => match.eloAfter),
        }))
      ));
  }

  GetRankedMatches(): Observable<RankingMatch[]> {
    return this.db
      .list<RankingMatch>(DB_MATCHES_LPATH, ref => ref.limitToLast(200))
      .snapshotChanges()
      .pipe(map(snapshots => snapshots
        .map(item => item.payload)
        .map(match => match.val())));
  }

  async GetLastTourneyDate(): Promise<string> {
    const lastRanked = await firstValueFrom(
      this.db
        .list<RankingMatch>(DB_MATCHES_LPATH, this.LastTourneyMatch())
        .snapshotChanges()
        .pipe(map(snapshots => snapshots.map(item => item.key.substring(0,8))[0]))
    )

    const lastImported = firstValueFrom(
      this.db
        .list<IncomingMatch>(DB_INCOMING_MATCHES_LPATH, this.LastTourneyMatch())
        .snapshotChanges()
        .pipe(map(snapshots => snapshots.map(item => item.key.substring(0,8))[0]))
    )

    return [lastImported, lastRanked].sort()[0];
  }

  private LastTourneyMatch() {
    return ref => ref
      .orderByChild('source')
      .equalTo('Tourney')
      .limitToLast(1);
  }

  GetUnrankedMatches(): Observable<Db<IncomingMatch>[]> {
    return this.db
      .list<IncomingMatch>(DB_INCOMING_MATCHES_LPATH)
      .snapshotChanges()
      .pipe(map(snapshots => snapshots
        .map(item => item.payload)
        .map(match => ({ key: match.key, ...match.val()}))
      ));
  }

  private GetRankingPlayers(): Observable<Db<EloPlayer>[]> {
    return this.db
      .list<EloPlayer>(DB_NEW_PLAYERS_PATH)
      .snapshotChanges()
      .pipe(map(snapshots => snapshots
        .map(item => item.payload)
        .map(player => ({
          key: player.key,
          name: this.nameFromKey(player.key),
          ...player.val()}))
      ));
  }

  async UpdateEloScores(): Promise<void> {
    let players = await firstValueFrom(this.GetRankingPlayers());
    let unrankedMatches = await firstValueFrom(this.GetUnrankedMatches());

    let matchData = unrankedMatches
      .map(match => ({
        match: { ... match, diff: 0 } as Db<RankingMatch>,
        p1: players.find(player => player.name === match.playerOne.name),
        p2: players.find(player => player.name === match.playerTwo.name),
      }))
      .filter(data => !!data.p1 && !!data.p2)
      .filter(data => !data.p1.changes.find(c => c.match === data.match.key))
      .filter(data => !data.p2.changes.find(c => c.match === data.match.key))

    matchData
      .forEach(data => {
        let elo1 = data.p1.changes[data.p1.changes.length - 1].eloAfter;
        let elo2 = data.p2.changes[data.p2.changes.length - 1].eloAfter;
        let completedMatch = {
          pointsScoredByOne: data.match.playerOne.points,
          pointsScoredByTwo: data.match.playerTwo.points,
          eloScoreOfOne: elo1,
          eloScoreOfTwo: elo2,
        }
        const diff = EloFunctions.calculate(completedMatch);
        data.p1.changes.push({
          match: data.match.key,
          eloAfter: elo1 + diff
        })
        data.p2.changes.push({
          match: data.match.key,
          eloAfter: elo2 - diff
        })
        data.match.diff = diff;
      });

    const evaluatedMatches = matchData.map(data => data.match);
    await this.SaveRankedMatches(evaluatedMatches);
    await this.UpdatePlayers(players);
    await this.RemoveIncomingMatches(evaluatedMatches);
  }

  private async RemoveIncomingMatches(matches: Db<IncomingMatch>[]): Promise<void[]> {
    let removals = matches.map(match => this.db
      .list(DB_INCOMING_MATCHES_LPATH)
      .remove(match.key));

    return Promise.all(removals);
  }

  UpdatePlayers(rankings: EloPlayer[]): Promise<void[]> {
    let updates = rankings
      .map(r => ({key: this.keyFromName(r.name), c: { changes: r.changes }}))
      .map(r => this.db
        .object(`${DB_NEW_PLAYERS_PATH}/${r.key}`)
        .update(r.c))

    return Promise.all(updates);
  }

  SaveRankedMatches(matches: Db<RankingMatch>[]): Promise<void[]> {
    let updates = matches
      .map(match => this.db
        .object(`${DB_MATCHES_LPATH}/${match.key}`)
        .update(match))

    return Promise.all(updates);
  }

  async reset(): Promise<void> {
    await this.db.object(DB_MATCHES_LPATH).remove();
    await this.db.object(DB_INCOMING_MATCHES_LPATH).remove();

    const players = await firstValueFrom(
      this.db
        .list<EloPlayer>('elo/players')
        .snapshotChanges());

    const updates = players
      .map(async player => await this.db
        .list<EloPlayer>(DB_NEW_PLAYERS_PATH)
        .update(player.key, {
          show: player.payload.val().show,
          changes: player.payload.val().changes.slice(0,1),
        }));

    await Promise.all(updates);
  }

  private nameFromKey(name: string): string {
    return name.replace('_', ' ');
  }

  private keyFromName(name: string): string {
    return name.replace(' ', '_');
  }
}

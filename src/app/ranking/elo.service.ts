import { Injectable, inject } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/compat/database';
import { Observable, firstValueFrom, map } from 'rxjs';
import { EloFunctions } from './elo-functions';
import { RankingPlayer } from './models/ranking-player';
import { IncomingMatch, ScoredMatch } from './models/ranking-match';
import { EloPlayer, EloPlayerData } from './models/elo-models';

const DB_MATCHES_LPATH = 'elo/rankedmatches';
export const DB_INCOMING_TOURNEY_MATCHES_LPATH = 'elo/incomingmatches/from-tourneys';
export const DB_INCOMING_CHALLENGE_MATCHES_LPATH = 'elo/incomingmatches/from-challenges';
export const DB_NEW_PLAYERS_PATH = 'elo/playersV2';

type FBase = { key: string }
type Db<T> = T & FBase;

@Injectable()
export class EloService {
  private readonly lowerBoundOnGames = 10;
  private readonly db = inject(AngularFireDatabase)

  GetRanking(): Observable<RankingPlayer[]> {
    return this
    .GetParticipatingPlayers()
      .pipe(
        map(snapshots => snapshots
          .filter(item => item.payload.val().changes.length > this.lowerBoundOnGames)
          .map(playerSnapshot => ({
            name: this.nameFromKey(playerSnapshot.key),
            allScores: playerSnapshot.payload
              .val().changes
              .map(match => match.wnb),
          })))
      );
  }

  GetParticipatingPlayerNames(): Observable<string[]> {
    return this
      .GetParticipatingPlayers()
      .pipe(map(snapshot => snapshot.map(item => this.nameFromKey(item.key))));
  }

  private GetParticipatingPlayers(): Observable<SnapshotAction<EloPlayerData>[]> {
    return this.db
      .list<EloPlayerData>(
        DB_NEW_PLAYERS_PATH,
        ref => ref
          .orderByChild('show')
          .equalTo(true))
      .snapshotChanges();
  }

  GetRankedMatches(nrOf: number): Observable<ScoredMatch[]> {
    return this.db
      .list<ScoredMatch>(DB_MATCHES_LPATH, ref => ref.limitToLast(nrOf))
      .valueChanges();
    }

  async GetLastTourneyDate(): Promise<string> {
    const lastRanked = await firstValueFrom(
      this.db
        .list<ScoredMatch>(DB_MATCHES_LPATH, this.LastTourneyMatch())
        .snapshotChanges()
        .pipe(map(snapshots => snapshots.map(item => item.key.substring(0,8))[0]))
    )

    const lastImported = firstValueFrom(
      this.db
        .list<IncomingMatch>(DB_INCOMING_TOURNEY_MATCHES_LPATH, this.LastTourneyMatch())
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

  async GetUnrankedMatches(): Promise<Db<IncomingMatch>[]> {
    const tourneySnapshots = await firstValueFrom(this.db
      .list<IncomingMatch>(DB_INCOMING_TOURNEY_MATCHES_LPATH)
      .snapshotChanges());

    const challengeSnapshots = await firstValueFrom(this.db
      .list<IncomingMatch>(DB_INCOMING_CHALLENGE_MATCHES_LPATH)
      .snapshotChanges())

    return tourneySnapshots
      .concat(challengeSnapshots)
      .map(item => item.payload)
      .map(match => ({ key: match.key, ...match.val()}));
  }

  private GetRankingPlayers(): Observable<Db<EloPlayer>[]> {
    return this.db
      .list<EloPlayerData>(DB_NEW_PLAYERS_PATH)
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
    let unrankedMatches = await this.GetUnrankedMatches();

    let matchData = unrankedMatches
      .map(match => ({
        match: { ... match, scores: {} } as Db<ScoredMatch>,
        p1: players.find(player => player.name === match.playerOne.name),
        p2: players.find(player => player.name === match.playerTwo.name),
      }))
      .filter(data => !!data.p1 && !!data.p2)
      .filter(data => !data.p1.changes.find(c => c.match === data.match.key))
      .filter(data => !data.p2.changes.find(c => c.match === data.match.key))

    matchData
      .forEach(data => {
        const eloInput = {
          p1Points: data.match.playerOne.points,
          p2Points: data.match.playerTwo.points,
          p1DataPoint: data.p1.changes[data.p1.changes.length - 1],
          p2DataPoint: data.p2.changes[data.p2.changes.length - 1]
        }

        const scores = EloFunctions.calculateAll(eloInput);
        data.p1.changes.push({
          match: data.match.key,
          ... EloFunctions.Add(eloInput.p1DataPoint, scores, 'P1')
        })
        data.p2.changes.push({
          match: data.match.key,
          ... EloFunctions.Add(eloInput.p2DataPoint, scores, 'P2')
        })
        data.match.scores = scores;
      });

    const evaluatedMatches = matchData.map(data => data.match);
    await this.SaveRankedMatches(evaluatedMatches);
    await this.UpdatePlayers(players);
    await this.RemoveIncomingMatches(evaluatedMatches);
  }

  private async RemoveIncomingMatches(matches: Db<IncomingMatch>[]): Promise<void[]> {
    let removals = matches
      .filter(match => match.source === 'Tourney')
      .map(match => this.db
        .list(DB_INCOMING_TOURNEY_MATCHES_LPATH)
        .remove(match.key));

    let challenges = matches
      .filter(match => match.source === 'Challenge')
      .map(match => this.db
        .list(DB_INCOMING_CHALLENGE_MATCHES_LPATH)
        .remove(match.key));

    return Promise.all(removals.concat(challenges));
  }

  UpdatePlayers(rankings: EloPlayer[]): Promise<void[]> {
    let updates = rankings
      .map(r => ({ key: this.keyFromName(r.name), c: { changes: r.changes } }))
      .map(r => this.db
        .object(`${DB_NEW_PLAYERS_PATH}/${r.key}`)
        .update(r.c))

    return Promise.all(updates);
  }

  SaveRankedMatches(matches: Db<ScoredMatch>[]): Promise<void[]> {
    let updates = matches
      .map(match => this.db
        .object(`${DB_MATCHES_LPATH}/${match.key}`)
        .update(match))

    return Promise.all(updates);
  }

  async reset(): Promise<void> {
    await this.db.object(DB_MATCHES_LPATH).remove();
    await this.db.object(DB_INCOMING_TOURNEY_MATCHES_LPATH).remove();

    const players = await firstValueFrom(
      this.db
        .list<EloPlayerData>('elo/players')
        .snapshotChanges());

    const updates = players
      .map(async player => await this.db
        .list<EloPlayerData>(DB_NEW_PLAYERS_PATH)
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

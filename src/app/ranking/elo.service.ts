import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, firstValueFrom, map } from 'rxjs';
import { Match } from '../tourney-series/models/match';
import { EloFunctions } from '../tourney-series/services/evaluation/elo-functions';
import { RankingPlayer } from './models/ranking-player';
import { EloPlayer } from './models/elo-player';

const DB_MATCHES_LPATH = 'elo/matches';
const DB_PLAYERS_PATH = 'elo/players';

type FBase = { key: string }
type Db<T> = T & FBase;

type RankingMatch = Match & {diff?: number }
@Injectable()
export class EloService {
  private readonly lowerBoundOnGames = 10;

  constructor(private db: AngularFireDatabase) { }

  GetRanking(): Observable<RankingPlayer[]> {
    return this.db
      .list<EloPlayer>(DB_PLAYERS_PATH, ref => ref.orderByChild('show').equalTo(true))
      .snapshotChanges()
      .pipe(
        map(snapshots => snapshots
          .map(item => item.payload)
          .filter(item => item.val().changes.length > this.lowerBoundOnGames)
          .map(player => ({
            name: this.nameFromKey(player.key),
            allScores: player.val().changes.map(match => match.eloAfter),
          }))
      ));
  }

  GetMatches(): Observable<Db<Match>[]> {
    return this.db
      .list<Match>(DB_MATCHES_LPATH, ref => ref.limitToLast(20))
      .snapshotChanges()
      .pipe(map(snapshots => snapshots
        .map(item => item.payload)
        .map(match => ({ key: match.key, ...match.val()}))));
  }

  private GetUnrankedMatches(): Observable<Db<RankingMatch>[]> {
    return this.db
      .list<Match>(DB_MATCHES_LPATH, ref => ref.orderByChild('diff').equalTo(null))
      .snapshotChanges()
      .pipe(map(snapshots => snapshots
        .map(item => item.payload)
        .map(match => ({ key: match.key, ...match.val()}))
      ));
  }

  private GetRankingFor(): Observable<Db<EloPlayer>[]> {
    return this.db
      .list<EloPlayer>(DB_PLAYERS_PATH)
      .snapshotChanges()
      .pipe(map(snapshots => snapshots
        .map(item => item.payload)
        .map(player => ({
          key: player.key,
          name: this.nameFromKey(player.key),
          ...player.val()}))
      ));
  }

  async Calculate(): Promise<void> {
    let rankings = await firstValueFrom(this.GetRankingFor());
    let unrankedMatches = await firstValueFrom(this.GetUnrankedMatches());
    console.log('Unranked matches: ', unrankedMatches.length);

    let data = unrankedMatches
      .map(match => ({
        match: match,
        p1: rankings.find(p => p.name === match.playerOne.name),
        p2: rankings.find(p => p.name === match.playerTwo.name),
      }))
      .filter(data => !!data.p1 && !!data.p2)
      // Test that idempotency does work properly
      .filter(data => !data.p1.changes.find(c => c.match === data.match.key))
      .filter(data => !data.p2.changes.find(c => c.match === data.match.key))

    console.log('Unranked matches that proceed: ', data.length);
    data
      .forEach(data => {
          // console.log('Ranking match: ', data.match);
          let elo1 = data.p1.changes[data.p1.changes.length - 1].eloAfter;
          let elo2 = data.p2.changes[data.p2.changes.length - 1].eloAfter;
          let completedMatch = {
            pointsScoredByOne: data.match.playerOne.points,
            pointsScoredByTwo: data.match.playerTwo.points,
            eloScoreOfOne: elo1,
            eloScoreOfTwo: elo2,
          }
          const diff = EloFunctions.calculate(completedMatch);
          data.p1.changes.push({match: data.match.key, eloAfter: elo1 + diff})
          data.p2.changes.push({match: data.match.key, eloAfter: elo2 - diff})
          data.match.diff = diff;
      });

    await this.UpdateMatches(data.map(d => d.match));
    console.log('Matches updated!');

    await this.UpdatePlayers(rankings);
    console.log('Players updated!');
  }

  UpdatePlayers(rankings: EloPlayer[]): Promise<void[]> {
    let rs = rankings
      .map(r => ({key: this.keyFromName(r.name), c: { changes: r.changes }}))
      .map(r => this.db
        .object(`${DB_PLAYERS_PATH}/${r.key}`)
        .update(r.c))
    return Promise.all(rs);
  }

  UpdateMatches(matches: Db<RankingMatch>[]): Promise<void[]> {
    let ms = matches
      .map(m => ({key: m.key, c: { diff: m.diff }}))
      .map(r => this.db
        .object(`${DB_MATCHES_LPATH}/${r.key}`)
        .update(r.c))
    return Promise.all(ms);
  }

  private nameFromKey(name: string): string {
    return name.replace('_', ' ');
  }

  private keyFromName(name: string): string {
    return name.replace(' ', '_');
  }
}

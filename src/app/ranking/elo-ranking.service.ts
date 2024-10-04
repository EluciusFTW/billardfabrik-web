import { Injectable, inject } from "@angular/core";
import { FirebaseService } from "../shared/firebase.service";
import { PlayersService } from "../players/players.service";
import { ComputedRankingPlayer, RankingPlayer } from "./models/ranking-player";
import { PlayerFunctions } from "../players/player-functions";
import { Observable, firstValueFrom, map } from "rxjs";
import { EloPlayer, EloPlayerData } from "./models/elo-models";
import { DB_INCOMING_CHALLENGE_MATCHES_LPATH, DB_INCOMING_TOURNEY_MATCHES_LPATH, DB_MATCHES_LPATH, DB_PLAYERS_PATH } from "./elo.service";
import { IncomingMatch, ScoredMatch } from "./models/ranking-match";
import { Db } from "../shared/firebase-utilities";
import { SnapshotAction } from "@angular/fire/compat/database";

@Injectable()
export class EloRankingService extends FirebaseService {
  private readonly lowerBoundOnGames = 10;
  private readonly playersService = inject(PlayersService);

  async GetRanking(): Promise<ComputedRankingPlayer[]> {
    const playerNames = await this.playersService
      .getEloPlayers()
      .then(players => players.map(PlayerFunctions.displayName));

    return firstValueFrom(
      this.db
        .list<EloPlayerData>(DB_PLAYERS_PATH)
        .snapshotChanges()
        .pipe(
          map(snapshots => snapshots
            .filter(item => item.payload.val().changes?.length > this.lowerBoundOnGames)
            .map(this.toComputedPlayerFromSnapshot)
            .filter(player => playerNames.includes(player.name))
          )));
  }

  async GetCachedRanking(): Promise<ComputedRankingPlayer[]> {
    const playerNames = await this.playersService
      .getEloPlayers()
      .then(players => players.map(PlayerFunctions.displayName));

    const rows = await firstValueFrom(
      this.db
        .list<ComputedRankingPlayer>('elo/ranking/123')
        .valueChanges());

    return rows.filter(row =>  playerNames.includes(row.name));
  }

  async UpdateRanking(): Promise<void> {
    const entries: ComputedRankingPlayer[] = await firstValueFrom(
      this.db
        .list<EloPlayerData>(DB_PLAYERS_PATH)
        .snapshotChanges()
        .pipe(
          map(snapshots => snapshots
            .filter(item => item.payload.val().changes?.length > this.lowerBoundOnGames)
            .map(this.toComputedPlayerFromSnapshot))
          ));

    await this.db.object('elo/ranking/123').set(entries);
  }
  private toComputedPlayerFromSnapshot(playerSnapshot: SnapshotAction<EloPlayerData>): ComputedRankingPlayer {
      const allScores = playerSnapshot.payload
        .val().changes
        .map(match => match.bvf);

      return this.toComputedPlayer(playerSnapshot.key, allScores)
  }

  private toComputedPlayer(key: string, allScores: number[]): ComputedRankingPlayer {
    return {
      name: PlayerFunctions.nameFromKey(key),
      allScores: allScores,
      ranking: allScores[allScores.length - 1],
      matches: allScores.length - 1, // -1 bc the initial seed is a score
      max: Math.max(...allScores),
      trend: allScores[allScores.length - 1] - allScores[allScores.length - 6]
    };
  }

  async GetRankingOf(playerName: string): Promise<ComputedRankingPlayer> {
    return firstValueFrom(
      this.db
        .list<EloPlayerData>(
          DB_PLAYERS_PATH,
          ref => ref
          .orderByKey().equalTo(playerName))
        .snapshotChanges()
        .pipe(
          map(snapshots => snapshots[0]),
          map(this.toComputedPlayerFromSnapshot)
        ));
  }

  async GetEloListedPlayers(): Promise<EloPlayer[]> {
    return firstValueFrom(
      this.db
        .object(DB_PLAYERS_PATH)
        .valueChanges()
        .pipe(
          map(value => value
            ? Object
                .entries(value)
                .map(kvp => ({
                    name: PlayerFunctions.nameFromKey(kvp[0]),
                    ... kvp[1]
                  } as EloPlayer))
            : []
        )));
  }

  GetRankedTourneyMatches(nrOf: number): Observable<ScoredMatch[]> {
    return this.db
      .list<ScoredMatch>(
        DB_MATCHES_LPATH,
        ref => ref
          .orderByChild('source').equalTo(`Tourney`)
          .limitToLast(nrOf))
      .valueChanges();
  }

  GetRankedChallenges(nrOf: number): Observable<ScoredMatch[]> {
    return this.db
      .list<ScoredMatch>(
        DB_MATCHES_LPATH,
        ref => ref
          .orderByChild('source').equalTo(`Challenge`)
          .limitToLast(nrOf))
      .valueChanges();
  }

  async GetUnrankedMatches(): Promise<Db<IncomingMatch>[]> {
    const tourneySnapshots = await firstValueFrom(this.db
      .list<IncomingMatch>(DB_INCOMING_TOURNEY_MATCHES_LPATH)
      .snapshotChanges());

    const challengeSnapshots = await firstValueFrom(this.db
      .list<IncomingMatch>(DB_INCOMING_CHALLENGE_MATCHES_LPATH)
      .snapshotChanges())

    const allMatches = tourneySnapshots
      .concat(challengeSnapshots)
      .map(item => item.payload)
      .map(match => ({ key: match.key, ...match.val()}));

    return allMatches.sort(this.compare)
  }

  private compare(a, b) {
    if ( a.key < b.key ){
      return -1;
    }
    if ( a.key > b.key ){
      return 1;
    }
    return 0;
  }
}

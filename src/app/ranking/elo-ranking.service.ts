import { Injectable, inject } from "@angular/core";
import { FirebaseService } from "../shared/firebase.service";
import { PlayersService } from "../players/players.service";
import { RankingPlayer } from "./models/ranking-player";
import { PlayerFunctions } from "../players/player-functions";
import { Observable, firstValueFrom, map } from "rxjs";
import { EloPlayer, EloPlayerData } from "./models/elo-models";
import { DB_INCOMING_CHALLENGE_MATCHES_LPATH, DB_INCOMING_TOURNEY_MATCHES_LPATH, DB_MATCHES_LPATH, DB_PLAYERS_PATH } from "./elo.service";
import { IncomingMatch, ScoredMatch } from "./models/ranking-match";
import { Db } from "../shared/firebase-utilities";

@Injectable()
export class EloRankingService extends FirebaseService {
  private readonly lowerBoundOnGames = 10;
  private readonly playersService = inject(PlayersService);

  async GetRanking(): Promise<RankingPlayer[]> {
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
            .map(playerSnapshot => ({
              name: PlayerFunctions.nameFromKey(playerSnapshot.key),
              allScores: playerSnapshot.payload
                .val().changes
                .map(match => match.bvf),
              }))
            .filter(player => playerNames.includes(player.name))
          )));
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

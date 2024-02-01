import { Injectable, inject } from "@angular/core";
import { FirebaseService } from "../shared/firebase.service";
import { PlayersService } from "../players/players.service";
import { RankingPlayer } from "./models/ranking-player";
import { PlayerFunctions } from "../players/player-functions";
import { Observable, firstValueFrom, map } from "rxjs";
import { EloPlayer, EloPlayerData } from "./models/elo-models";
import { DB_INCOMING_CHALLENGE_MATCHES_LPATH, DB_INCOMING_TOURNEY_MATCHES_LPATH, DB_MATCHES_LPATH, DB_NEW_PLAYERS_PATH } from "./elo.service";
import { IncomingMatch, ScoredMatch } from "./models/ranking-match";
import { Db } from "../shared/firebase-utilities";

@Injectable()
export class EloRankingService extends FirebaseService {
  private readonly lowerBoundOnGames = 10;
  private readonly playersService = inject(PlayersService);

  async GetRanking(): Promise<RankingPlayer[]> {
    const playerNames = await this.GetPlayerNames();

    return firstValueFrom(
      this.db
        .list<EloPlayerData>(DB_NEW_PLAYERS_PATH)
        .snapshotChanges()
        .pipe(
          map(snapshots => snapshots
            .filter(item => item.payload.val().changes?.length > this.lowerBoundOnGames)
            .map(playerSnapshot => ({
              name: PlayerFunctions.nameFromKey(playerSnapshot.key),
              allScores: playerSnapshot.payload
                .val().changes
                .map(match => match.wnb),
              }))
            .filter(player => playerNames.includes(player.name))
          )));
  }

  async GetEloPlayers(): Promise<EloPlayer[]> {
    const playerNames = await this.GetPlayerNames();

    return firstValueFrom(
      this.db
        .object(DB_NEW_PLAYERS_PATH)
        .valueChanges()
        .pipe(
          map(value => Object
            .entries(value)
            .map(kvp => ({
                name: PlayerFunctions.nameFromKey(kvp[0]),
                ... kvp[1]
              } as EloPlayer))
            .filter(player => player.changes.length < this.lowerBoundOnGames)
            .filter(player => playerNames.includes(player.name)
        ))));
  }

  private GetPlayerNames(): Promise<string[]> {
    const playerNames$ = this.playersService
      .getEloPlayers()
      .pipe(map(ps => ps.map(p => PlayerFunctions.displayName(p))))
    return firstValueFrom(playerNames$);
  }

  GetRankedMatches(nrOf: number): Observable<ScoredMatch[]> {
    return this.db
      .list<ScoredMatch>(DB_MATCHES_LPATH, ref => ref.limitToLast(nrOf))
      .valueChanges();
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
}

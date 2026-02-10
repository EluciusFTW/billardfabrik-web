import { Injectable, inject } from "@angular/core";
import { FirebaseService } from "../shared/firebase.service";
import { PlayersService } from "../players/players.service";
import { RankingPlayer } from "./models/ranking-player";
import { PlayerFunctions } from "../players/player-functions";
import { Observable, firstValueFrom, map } from "rxjs";
import { EloPlayer, EloPlayerData } from "./models/elo-models";
import { DB_INCOMING_CHALLENGE_MATCHES_LPATH, DB_INCOMING_TOURNEY_MATCHES_LPATH, DB_MATCHES_LPATH, DB_PLAYERS_PATH } from "./elo.service";
import { IncomingMatch, ScoredMatch } from "./models/ranking-match";
import { compareByKey, Db, listValWithKey } from "../shared/firebase-utilities";
import { equalTo, limitToLast, listVal, objectVal, orderByChild, query, ref } from "@angular/fire/database";

@Injectable()
export class EloRankingService extends FirebaseService {
  private readonly lowerBoundOnGames = 10;
  private readonly playersService = inject(PlayersService);

  private readonly playersRef = ref(this.db, DB_PLAYERS_PATH);

  async GetRanking(): Promise<RankingPlayer[]> {
    const playerNames = new Set(
      (await this.playersService.getEloPlayers())
        .map(PlayerFunctions.displayName)
    );

    return firstValueFrom(
      listValWithKey<EloPlayerData>(this.playersRef)
        .pipe(
          map(players =>
            players
              .filter(p => p.changes?.length > this.lowerBoundOnGames)
              .map(p => ({
                name: PlayerFunctions.nameFromKey(p.key),
                allScores: p.changes.map(match => match.bvf),
              }))
              .filter(player => playerNames.has(player.name))
          )
        )
    );
  }

  async GetEloListedPlayers(): Promise<EloPlayer[]> {
    return firstValueFrom(
      objectVal<Record<string, EloPlayer>>(ref(this.db, DB_PLAYERS_PATH)).pipe(
        map(dictionary =>
          dictionary
            ? Object.entries(dictionary).map(([key, player]) => ({
              name: PlayerFunctions.nameFromKey(key),
              ...player
            }))
            : []
        )
      )
    );
  }

  GetRankedTourneyMatches(nrOf: number): Observable<ScoredMatch[]> {
    const q = query(
      ref(this.db, DB_MATCHES_LPATH),
      orderByChild('source'),
      equalTo('Tourney'),
      limitToLast(nrOf));

    return listVal<ScoredMatch>(q);
  }

  GetRankedChallenges(nrOf: number): Observable<ScoredMatch[]> {
    const q = query(
      ref(this.db, DB_MATCHES_LPATH),
      orderByChild('source'),
      equalTo('Challenge'),
      limitToLast(nrOf));

    return listVal<ScoredMatch>(q);
  }

  async GetUnrankedMatches(): Promise<Db<IncomingMatch>[]> {
    const fromTourneys = await firstValueFrom(
      listValWithKey<IncomingMatch>(ref(this.db, DB_INCOMING_TOURNEY_MATCHES_LPATH))
    );

    const fromChallenges = await firstValueFrom(
      listValWithKey<IncomingMatch>(ref(this.db, DB_INCOMING_CHALLENGE_MATCHES_LPATH))
    );

    return fromTourneys.concat(fromChallenges).sort(compareByKey);
  }
}

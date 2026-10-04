import { Service, inject } from "@angular/core";
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

@Service()
export class EloRankingService extends FirebaseService {
  private readonly lowerBoundOnGames = 10;
  private readonly playersService = inject(PlayersService);
  private readonly playersRef = ref(this.db, DB_PLAYERS_PATH);

  async GetRanking(): Promise<RankingPlayer[]> {
    const playerNames = await this.playersService
      .getEloPlayers()
      .then(players => players.map(PlayerFunctions.displayName));

    return firstValueFrom(
      listValWithKey<EloPlayerData>(this.playersRef)
        .pipe(
          map(players => players
            .filter(player => player.changes?.length > this.lowerBoundOnGames)
            .map(player => ({
              name: PlayerFunctions.nameFromKey(player.key),
              allScores: player.changes.map(match => match.bvf),
            }))
            .filter(player => playerNames.includes(player.name))
          )));
  }

  async GetEloListedPlayers(): Promise<EloPlayer[]> {
    return firstValueFrom(
      objectVal<Record<string, EloPlayerData>>(this.playersRef)
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
    return this.GetRankedMatches('Tourney', nrOf);
  }

  GetRankedChallenges(nrOf: number): Observable<ScoredMatch[]> {
    return this.GetRankedMatches('Challenge', nrOf);
  }

  private GetRankedMatches(source: IncomingMatch['source'], nrOf: number): Observable<ScoredMatch[]> {
    const q = query(
      ref(this.db, DB_MATCHES_LPATH),
      orderByChild('source'),
      equalTo(source),
      limitToLast(nrOf));

    return listVal<ScoredMatch>(q);
  }

  async GetUnrankedMatches(): Promise<Db<IncomingMatch>[]> {
    const fromTourneys = await firstValueFrom(
      listValWithKey<IncomingMatch>(ref(this.db, DB_INCOMING_TOURNEY_MATCHES_LPATH)));

    const fromChallenges = await firstValueFrom(
      listValWithKey<IncomingMatch>(ref(this.db, DB_INCOMING_CHALLENGE_MATCHES_LPATH)));

    return fromTourneys
      .concat(fromChallenges)
      .sort(compareByKey);
  }
}

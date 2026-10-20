import { Service, inject } from "@angular/core";
import { FirebaseService } from "../shared/firebase.service";
import { PlayersService } from "../players/players.service";
import { Leaderboard, RankingPlayer } from "./models/ranking-player";
import { LeaderboardFunctions } from "./leaderboard-functions";
import { PlayerFunctions } from "../players/player-functions";
import { Observable, combineLatest, firstValueFrom, map } from "rxjs";
import { EloDataPoint, EloPlayer, EloPlayerData } from "./models/elo-models";
import { DB_INCOMING_CHALLENGE_MATCHES_LPATH, DB_INCOMING_TOURNEY_MATCHES_LPATH, DB_LEADERBOARD_PATH, DB_MATCHES_LPATH, DB_PLAYERS_PATH } from "./elo.service";
import { IncomingMatch, ScoredMatch } from "./models/ranking-match";
import { compareByKey, Db, listValWithKey, withoutKey } from "../shared/firebase-utilities";
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

    const leaderboard = await this.GetLeaderboard();

    return Object
      .entries(leaderboard)
      .map(([key, entry]) => ({ name: PlayerFunctions.nameFromKey(key), ...entry }))
      .filter(player => player.matches >= this.lowerBoundOnGames)
      .filter(player => playerNames.includes(player.name));
  }

  async GetScoreHistory(name: string): Promise<number[]> {
    const changesRef = ref(this.db, `${DB_PLAYERS_PATH}/${PlayerFunctions.keyFromName(name)}/changes`);
    // objectVal would spread the array into a plain object, listVal keeps it a list
    const changes = await firstValueFrom(listVal<EloDataPoint>(changesRef));
    return changes.map(change => change.bvf);
  }

  // Falls back to computing from the full history until the first import has written the snapshot.
  private async GetLeaderboard(): Promise<Leaderboard> {
    const snapshot = await firstValueFrom(objectVal<Leaderboard>(ref(this.db, DB_LEADERBOARD_PATH)));
    if (snapshot) {
      return snapshot;
    }

    const players = await firstValueFrom(objectVal<Record<string, EloPlayerData>>(this.playersRef));
    return LeaderboardFunctions.fromPlayers(players ?? {});
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
    return combineLatest([
      this.GetRankedMatches('Tourney', nrOf),
      this.GetRankedMatches('UniqueTourney', nrOf)
    ]).pipe(
      map(([series, unique]) => series
        .concat(unique)
        .sort(compareByKey)
        .slice(-nrOf)
        .map(match => withoutKey(match))));
  }

  // all ranked matches, in the order they were ranked
  async GetAllRankedMatches(): Promise<ScoredMatch[]> {
    return firstValueFrom(
      listValWithKey<ScoredMatch>(ref(this.db, DB_MATCHES_LPATH))
        .pipe(map(matches => matches
          .sort(compareByKey)
          .map(match => withoutKey(match)))));
  }

  GetRankedChallenges(nrOf: number): Observable<ScoredMatch[]> {
    return this.GetRankedMatches('Challenge', nrOf);
  }

  private GetRankedMatches(source: IncomingMatch['source'], nrOf: number): Observable<Db<ScoredMatch>[]> {
    const q = query(
      ref(this.db, DB_MATCHES_LPATH),
      orderByChild('source'),
      equalTo(source),
      limitToLast(nrOf));

    return listValWithKey<ScoredMatch>(q);
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

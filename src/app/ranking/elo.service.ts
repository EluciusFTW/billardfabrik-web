import { Service, inject } from '@angular/core';
import { EloFunctions } from './elo-functions';
import { IncomingMatch, ScoredMatch } from './models/ranking-match';
import { EloDataPoint, EloPlayer } from './models/elo-models';
import { Leaderboard } from './models/ranking-player';
import { LeaderboardFunctions } from './leaderboard-functions';
import { Db } from '../shared/firebase-utilities';
import { PlayerFunctions } from '../players/player-functions';
import { FirebaseService } from '../shared/firebase.service';
import { EloRankingService } from './elo-ranking.service';
import { ref, update } from '@angular/fire/database';

export const DB_MATCHES_LPATH = 'elo/rankedmatches';
export const DB_INCOMING_TOURNEY_MATCHES_LPATH = 'elo/incomingmatches/from-tourneys';
export const DB_INCOMING_CHALLENGE_MATCHES_LPATH = 'elo/incomingmatches/from-challenges';
export const DB_PLAYERS_PATH = 'elo/players';
export const DB_LEADERBOARD_PATH = 'elo/leaderboard';

@Service()
export class EloService extends FirebaseService {
  private readonly rankingService = inject(EloRankingService);

  async UpdateEloScores(): Promise<void> {
    let eloPlayers = await this.rankingService.GetEloListedPlayers();
    let unrankedMatches = await this.rankingService.GetUnrankedMatches();
    const persistedLengths = new Map(eloPlayers.map(player => [player.name, player.changes.length]));

    let matchData = unrankedMatches
      .map(match => ({
        match: { ... match, scores: {} } as Db<ScoredMatch>,
        p1: eloPlayers.find(player => player.name === match.playerOne.name)
          ?? this.createNewPlayer(match.playerOne.name, eloPlayers),
        p2: eloPlayers.find(player => player.name === match.playerTwo.name)
          ?? this.createNewPlayer(match.playerTwo.name, eloPlayers),
      }))
      .filter(data => !data.p1.changes.find(c => c.match === data.match.key))
      .filter(data => !data.p2.changes.find(c => c.match === data.match.key))

    matchData
      .forEach(data => {
        const eloInput = {
          discipline: data.match.discipline,
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
    await update(ref(this.db), {
      ...this.rankedMatchUpdates(evaluatedMatches),
      ...this.appendedChanges(eloPlayers, persistedLengths),
      ...this.incomingMatchRemovals(evaluatedMatches),
      [DB_LEADERBOARD_PATH]: this.leaderboardOf(eloPlayers),
    });
  }

  private createNewPlayer(name: string, existing: EloPlayer[]) {
    const newPlayer = {
      name: name,
      changes: [{
        match: '__InitialSeed__',
        cla: EloFunctions.InitialValue,
        bvf: EloFunctions.InitialValue,
        wwb: EloFunctions.InitialValue,
        wnb: EloFunctions.InitialValue,
      }],
    };

    existing.push(newPlayer);
    return newPlayer;
  }

  private rankedMatchUpdates(matches: Db<ScoredMatch>[]): Record<string, ScoredMatch> {
    return Object.fromEntries(matches
      .map(match => [`${DB_MATCHES_LPATH}/${match.key}`, match]));
  }

  // Only writes the data points added in this run, players' histories are append-only.
  private appendedChanges(players: EloPlayer[], persistedLengths: Map<string, number>): Record<string, EloDataPoint> {
    return Object.fromEntries(players
      .flatMap(player => {
        const changesPath = `${DB_PLAYERS_PATH}/${PlayerFunctions.keyFromName(player.name)}/changes`;
        const persisted = persistedLengths.get(player.name) ?? 0;
        return player.changes
          .slice(persisted)
          .map((change, offset) => [`${changesPath}/${persisted + offset}`, change]);
      }));
  }

  private incomingMatchRemovals(matches: Db<IncomingMatch>[]): Record<string, null> {
    return Object.fromEntries(matches
      .map(match => [`${this.incomingPathOf(match)}/${match.key}`, null]));
  }

  private incomingPathOf(match: IncomingMatch): string {
    return match.source === 'Challenge'
      ? DB_INCOMING_CHALLENGE_MATCHES_LPATH
      : DB_INCOMING_TOURNEY_MATCHES_LPATH;
  }

  private leaderboardOf(players: EloPlayer[]): Leaderboard {
    return Object.fromEntries(players
      .map(player => [PlayerFunctions.keyFromName(player.name), LeaderboardFunctions.entryFor(player)]));
  }
}

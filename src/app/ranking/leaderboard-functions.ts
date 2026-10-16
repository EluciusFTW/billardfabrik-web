import { EloPlayerData } from "./models/elo-models";
import { Leaderboard, LeaderboardEntry } from "./models/ranking-player";

export class LeaderboardFunctions {
  private static readonly trendWindow = 5;

  public static fromPlayers(players: Record<string, EloPlayerData>): Leaderboard {
    return Object.fromEntries(
      Object
        .entries(players)
        .map(([key, player]) => [key, this.entryFor(player)]));
  }

  public static entryFor(player: EloPlayerData): LeaderboardEntry {
    const scores = player.changes.map(change => change.bvf);
    const ranking = scores[scores.length - 1];
    const trendBase = scores[Math.max(0, scores.length - 1 - this.trendWindow)];

    return {
      ranking,
      matches: scores.length - 1, // -1 bc the initial seed is a score
      max: Math.max(...scores),
      trend: ranking - trendBase,
    };
  }
}

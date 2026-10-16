export type LeaderboardEntry = {
  ranking: number;
  matches: number;
  max: number;
  trend: number;
}

export type Leaderboard = Record<string, LeaderboardEntry>;

export type RankingPlayer = LeaderboardEntry & {
  name: string;
}

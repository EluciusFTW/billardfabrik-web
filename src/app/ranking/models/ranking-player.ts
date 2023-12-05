export type RankingPlayer = {
  name: string;
  allScores: number[]
}

export type ComputedRankingPlayer = RankingPlayer & {
  max: number;
  trend: number;
  ranking: number;
  matches: number;
}

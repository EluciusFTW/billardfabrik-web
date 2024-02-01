export type EloPlayerData = {
  changes: EloDataPoint[];
}

export type EloPlayer = EloPlayerData & { name: string; };

export type EloScores = {
  cla: number;
  bvf: number;
  wwb: number;
  wnb: number;
};

export type EloStanding = EloScores;

export type EloDataPoint = EloStanding & {
  match: string;
};

export type EloMode = 'classic' | 'weighted' | 'weightedWithBonus';

export type MatchPoints = {
  p1Points: number;
  p2Points: number;
}

export type EloCalculationInput = MatchPoints & {
  p1Elo: number;
  p2Elo: number;
}

export type EloMatchInput = MatchPoints & {
  p1DataPoint: EloDataPoint;
  p2DataPoint: EloDataPoint;
}

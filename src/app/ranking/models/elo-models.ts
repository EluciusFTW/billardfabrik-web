import { PoolDiscipline } from "src/app/tourney-series/models/pool-discipline";

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

export type EloPlayerData = {
  changes: EloDataPoint[];
}

export type EloPlayer = EloPlayerData & { name: string; };

export type EloMode = 'classic' | 'weighted' | 'weightedWithBonus';

export type MatchPoints = {
  p1Points: number;
  p2Points: number;
}

export type NormalizedPoints = {
  p1NormalizedPoints: number;
  p2NormalizedPoints: number;
}

export type EloMatchInput = MatchPoints & {
  p1DataPoint: EloDataPoint;
  p2DataPoint: EloDataPoint;
  discipline: PoolDiscipline;
}

export type EloCalculationInput = NormalizedPoints & {
  p1Elo: number;
  p2Elo: number;
}

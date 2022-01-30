import { MatchType } from './match';
import { PoolDiscipline } from './pool-discipline';

export interface TourneyEvaluation {
  players: TourneyPlayerEvaluation[];
}

export interface TourneyPlayerEvaluation {
  name: string;
  matches: PlayerMatchRecord[]
  placement: PlacementRecord
}

export interface PlacementRecord extends BaseRecord {
  placement: TourneyPlacementType;
  points: number;
}

export interface PlayerMatchRecord extends BaseRecord {
  opponent: string;
  myScore: number;
  oppScore: number;
  type: MatchType;
  when: number;
}

export interface BaseRecord {
  discipline: PoolDiscipline;
  tourney?: string;
}

export enum TourneyPlacementType {
  GroupStage,
  EigthFinal,
  QuarterFinal,
  FourthPlace,
  ThirdPlace,
  RunnerUp,
  Winner
}

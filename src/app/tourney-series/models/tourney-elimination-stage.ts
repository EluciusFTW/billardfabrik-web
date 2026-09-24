import { Match } from './match';
import { TourneyDoubleEliminationStageType } from './tourney-double-elimination-stage-type';
import { TourneyPhaseStatus } from './tourney-phase-status';
import { TourneyEliminationStageType } from './tourney-single-elimination-stage-type';

interface TourneyEliminationStageBase {
  title: string;
  matches: Match[];
  status: TourneyPhaseStatus;
}

export interface SingleEliminationEliminationStage extends TourneyEliminationStageBase {
  eliminationType: 'Single';
  type: TourneyEliminationStageType;
}

export interface DoubleEliminationEliminationStage extends TourneyEliminationStageBase {
  eliminationType: 'Double';
  type: TourneyDoubleEliminationStageType;
}

export type TourneyEliminationStage = SingleEliminationEliminationStage | DoubleEliminationEliminationStage;

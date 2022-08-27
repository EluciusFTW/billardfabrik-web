import { PoolDiscipline } from './pool-discipline';
import { TourneyMode } from './tourney-mode';
import { TourneyEliminationStageType } from './tourney-single-elimination-stage-type';

export interface TourneyInfo {
  players: string[];
  raceLength: number;
  discipline: PoolDiscipline;
  mode: TourneyMode;
  name: string;
}

export interface GroupsThenSingleEliminationTourneyInfo extends TourneyInfo {
  nrOfGroups: number;
}

export interface DoubleEliminationTourneyInfo extends TourneyInfo {
  firstEliminationStage: TourneyEliminationStageType;
}

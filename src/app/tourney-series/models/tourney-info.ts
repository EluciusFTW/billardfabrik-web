import { PoolDiscipline } from './pool-discipline';
import { TourneyMode } from './tourney-mode';
import { TourneyEliminationStageType } from './tourney-single-elimination-stage-type';
import { KnockoutPairing } from './knockout-pairing';

export interface TourneyInfo {
  players: string[];
  raceLength: number;
  discipline: PoolDiscipline;
  mode: TourneyMode;
  name: string;
  seeded: boolean;
  unique?: boolean;
}

export interface SingleEliminationTourneyInfo extends TourneyInfo {}

export interface GroupsThenSingleEliminationTourneyInfo extends TourneyInfo {
  nrOfGroups: number;
  knockoutPairing: KnockoutPairing;
}

export interface DoubleEliminationTourneyInfo extends TourneyInfo {
  firstEliminationStage: TourneyEliminationStageType;
}

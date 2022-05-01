import { PoolDiscipline } from './pool-discipline';
import { TourneyEliminationStageType } from './tourney-elimination-stage';
import { TourneyMode } from './tourney-mode';

export interface TourneyInfo {
    players: string[];
    nrOfGroups: number;
    raceLength: number;
    discipline: PoolDiscipline;
    mode: TourneyMode;
    name: string;
}

export interface GruopsThenSingleEliminationTourneyInfo extends TourneyInfo {
    nrOfGroups: number;
}

export interface DoubleEliminationTourneyInfo extends TourneyInfo {
    firstEliminationStage: TourneyEliminationStageType;
}

import { TourneyGroup } from './tourney-group';
import { TourneyMeta } from './tourney-meta';
import { TourneyDoubleEliminationStage } from './tourney-double-elimination-stage';
import { TourneyEliminationStage } from './tourney-elimination-stage';

export interface Tourney {
    groups?: TourneyGroup[];
    doubleEliminationStages?: TourneyDoubleEliminationStage[];
    eliminationStages?: TourneyEliminationStage[];
    meta?: TourneyMeta;
}

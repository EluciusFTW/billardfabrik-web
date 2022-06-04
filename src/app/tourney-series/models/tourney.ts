import { TourneyGroup } from './tourney-group';
import { TourneyMeta } from './tourney-meta';
import { DoubleEliminationEliminationStage, SingleEliminationEliminationStage } from './tourney-elimination-stage';

export interface Tourney {
    groups?: TourneyGroup[];
    doubleEliminationStages?: DoubleEliminationEliminationStage[];
    eliminationStages?: SingleEliminationEliminationStage[];
    meta?: TourneyMeta;
}

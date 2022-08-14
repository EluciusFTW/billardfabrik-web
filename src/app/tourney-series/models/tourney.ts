import { DoubleEliminationEliminationStage, SingleEliminationEliminationStage } from './tourney-elimination-stage';
import { TourneyGroup } from './tourney-group';
import { TourneyMeta } from './tourney-meta';

export interface Tourney {
    groups?: TourneyGroup[];
    doubleEliminationStages?: DoubleEliminationEliminationStage[];
    eliminationStages?: SingleEliminationEliminationStage[];
    meta?: TourneyMeta;
}

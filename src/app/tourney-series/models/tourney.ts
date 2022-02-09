import { TourneyGroup } from './tourney-group';
import { TourneyMeta } from './tourney-meta';
import { TourneyEliminationStage } from './Tourney-elimination-stage';

export interface Tourney {
    groups?: TourneyGroup[];
    eliminationStages?: TourneyEliminationStage[];
    meta?: TourneyMeta;
}

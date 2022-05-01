import { TourneyStatus } from './tourney-status';
import { PoolDiscipline } from './pool-discipline';
import { TourneyMode } from './tourney-mode';

export interface TourneyMeta {
    name: string;
    date: string;
    status: TourneyStatus;
    discipline: PoolDiscipline;
    modus: TourneyMode;
}

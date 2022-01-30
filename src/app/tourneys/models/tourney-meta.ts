import { TourneyStatus } from './tourney-status';
import { PoolDiscipline } from './pool-discipline';

export interface TourneyMeta {
    name: string;
    date: string;
    status: TourneyStatus;
    discipline: PoolDiscipline;
}

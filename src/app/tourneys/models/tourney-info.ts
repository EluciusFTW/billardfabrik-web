import { PoolDiscipline } from './pool-discipline';

export interface TourneyInfo {
    players: string[];
    nrOfGroups: number;
    raceLength: number;
    discipline: PoolDiscipline;
    name: string;
}

import { TourneyStatus } from './tourney-status';
import { PoolDiscipline } from './pool-discipline';
import { TourneyMode } from './tourney-mode';
import { KnockoutPairing } from './knockout-pairing';

export interface TourneyMeta {
    name: string;
    numberOfPlayers: number;
    date: string;
    status: TourneyStatus;
    discipline: PoolDiscipline;
    modus: TourneyMode;
    // only set for group tourneys; tourneys created before it existed were paired randomly
    knockoutPairing?: KnockoutPairing;
    occurrence?: number;
    unique?: boolean;
}

import { MatchPlayer } from './match-player';
import { MatchStatus } from './match-status';
import { PoolDiscipline } from './pool-discipline';

export interface Match {
    playerOne: MatchPlayer;
    playerTwo: MatchPlayer;
    discipline: PoolDiscipline;
    length: number;
    status: MatchStatus;
}

export enum MatchType {
    Group,
    Elimination,
    Challenge,
    League,
    Other
}

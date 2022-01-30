import { Match } from './match';
import { TourneyPhaseStatus } from './tourney-phase-status';

export interface TourneyEliminationStage {
    type: TourneyEliminationStageType;
    players: string[];
    matches: Match[];
    status: TourneyPhaseStatus;
}

export enum TourneyEliminationStageType {
    eigthFinal,
    quarterFinal,
    semiFinal,
    thirdPlace,
    final
}

export namespace TourneyEliminationStageType {
    export function after(value: TourneyEliminationStageType): TourneyEliminationStageType {
        return value + 1;
    }
}

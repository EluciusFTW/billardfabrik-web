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
    const _stageStrings = [
        'Achtelfinale',
        'Viertelfinale',
        'Halbfinale',
        'Spiel um Platz 3',
        'Finale'
    ];
    
    export function after(value: TourneyEliminationStageType): TourneyEliminationStageType {
        return value + 1;
    }

    export function map(stage: TourneyEliminationStageType){
        return _stageStrings[stage]
    }
}

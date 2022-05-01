import { Match } from './match';
import { TourneyPhaseStatus } from './tourney-phase-status';

const _stageStrings = [
    'Achtelfinale',
    'Viertelfinale',
    'Halbfinale',
    'Spiel um Platz 3',
    'Finale'
];

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

    export function map(stage: TourneyEliminationStageType){
        return this._strings[stage]
    }
}

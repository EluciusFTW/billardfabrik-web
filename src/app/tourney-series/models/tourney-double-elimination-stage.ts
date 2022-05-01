import { Match } from './match';
import { TourneyPhaseStatus } from './tourney-phase-status';

export interface TourneyDoubleEliminationStage {
    type: TourneyDoubleEliminationStageType;
    players: string[];
    matches: Match[];
    status: TourneyPhaseStatus;
}

export enum TourneyDoubleEliminationStageType {
}

export namespace TourneyDoubleEliminationStageType {
    const _stageStrings = [
    ];
    
    export function map(stage: TourneyDoubleEliminationStageType){
        return _stageStrings[stage]
    }
}

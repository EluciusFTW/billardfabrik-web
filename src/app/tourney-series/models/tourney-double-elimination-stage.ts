import { Match } from './match';
import { TourneyPhaseStatus } from './tourney-phase-status';

export interface TourneyDoubleEliminationStage {
    type: TourneyDoubleEliminationStageType;
    players: string[];
    matches: Match[];
    status: TourneyPhaseStatus;
}

export enum TourneyDoubleEliminationStageType {
    Final = 30,
    WinnerFinal = 26,
    LoserFinal = 25,
    Entry4 = 24,
    LoserLast3 = 23,
    WinnerSemi = 22,
    LoserSemiFinal = 21,
    Entry8 = 20,
    LoserLast6 = 19,
    WinnerQuarterFinal = 18,
    LoserQuareterFinal = 17,
    Entry16 = 16,
    LoserLast12 = 15,
    WinnerLast16 = 14,
    LoserLast16 = 13,
    Entry32 = 12,
    LoserLast24 = 11,
    WinnerLast32 = 10,
    LoserLast32 = 9,
    Entry64 = 8,
    LoserLast48 = 7,
    WinnerLast64 = 6,
    LoserLast64 = 5,
    Entry128 = 4,
    LoserLast96 = 3,
    WinnerLast128 = 2,
    LoserLast128 = 1,
    Entry256 = 0
}

export namespace TourneyDoubleEliminationStageType {
    const _stageStrings = [
    ];

    export function map(stage: TourneyDoubleEliminationStageType){
        return _stageStrings[stage]
    }
}

import { Match } from './match';
import { TourneyEliminationStageType } from './tourney-elimination-stage';
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

  export function map(stage: TourneyDoubleEliminationStageType) {
    return _stageStrings[stage]
  }

  export function startingStage(numberOfPlayers: number): TourneyDoubleEliminationStageType {
    if (numberOfPlayers > 256) {
      throw Error(`${numberOfPlayers} is too many players for a double elimination tourney.`)
    }

    let entryStage = TourneyDoubleEliminationStageType.Entry256;
    while (this.numberOfPlayers((entryStage + 4) as TourneyDoubleEliminationStageType) > numberOfPlayers) {
      entryStage + 4;
    }

    return entryStage;
  }

  export function numberOfPlayers(value: TourneyDoubleEliminationStageType) {
    if (value === TourneyDoubleEliminationStageType.Final) {
      return 2;
    }

    if (value % 4 !== 0) {
      throw Error('In a double elimination tourney, it only makes sense to ask this for entry point stages.')
    }

    return Math.pow(2, 8 - value / 4);
  }
}

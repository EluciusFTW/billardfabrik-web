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
    'Einstieg 256',
    'Verlierer Letzte 128',
    'Gewinner Letzte 128',
    'Verlierer Letzte 96',
    'Einstieg 128',
    'Verlierer Letzte 64',
    'Gewinner Letzte 64',
    'Verlierer Letzte 48',
    'Einstieg 64',
    'Verlierer Letzte 32',
    'Gewinner Letzte 32',
    'Verlierer Letzte 24',
    'Einstieg 32',
    'Verlierer Achtelfinale',
    'Gewinner Achtelfinale',
    'Verlierer Letzte 12',
    'Einstieg 16',
    'Verlierer Viertelfinale',
    'Gewinner Viertelfinale',
    'Verlierer Letzte 6',
    'Einstieg 8',
    'Verlierer Halbfinale',
    'Gewinner Halbfinale',
    'Verlierer Letzte 3',
    'Einstieg 4',
    'Verlierer Finale',
    'Gewinner Finale',
    '-', '-', '-',
    'Finale',
  ];

  export function map(stage: TourneyDoubleEliminationStageType) {
    return _stageStrings[stage]
  }

  export function all(): TourneyDoubleEliminationStageType[] {
    return Object
      .keys(TourneyDoubleEliminationStageType)
      .filter(value => !isNaN(Number(value)))
      .map(value => +value);
  }

  export function getWinnerStages(): TourneyDoubleEliminationStageType[] {
    return all()
        .filter(value => value < TourneyDoubleEliminationStageType.Final)
        .filter(value => value % 4 === 2)
  }

  export function getLooserStages(): TourneyDoubleEliminationStageType[] {
    return all()
        .filter(value => value < TourneyDoubleEliminationStageType.Final )
        .filter(value => value % 2 === 1)
  }

  export function getStartingStages(): TourneyDoubleEliminationStageType[] {
    return all()
        .filter(value => value < TourneyDoubleEliminationStageType.Final )
        .filter(value => value % 4 === 0)
  }

  export function startingStage(numberOfPlayers: number): TourneyDoubleEliminationStageType {
    if (numberOfPlayers > 256) {
      throw Error(`${numberOfPlayers} is too many players for a double elimination tourney.`)
    }

    let entryStage = TourneyDoubleEliminationStageType.Entry256;
    while (numberOfPlayersInStartingStage((entryStage + 4) as TourneyDoubleEliminationStageType) > numberOfPlayers) {
      entryStage = entryStage + 4;
    }

    return entryStage;
  }

  export function lastWinnerStage(numberOfPlayersToRemain: number): TourneyDoubleEliminationStageType {
    if (numberOfPlayersToRemain <= 2) {
      return TourneyDoubleEliminationStageType.Final
    }

    let exitStage = TourneyDoubleEliminationStageType.WinnerFinal;
    while (playersInStage(exitStage) < numberOfPlayersToRemain) {
      exitStage = exitStage - 4;
    }

    return exitStage;
  }

  export function playersInStage(stage: TourneyDoubleEliminationStageType) {
    switch(stage % 4){
      case 0: return Math.pow(2, 8 - stage / 4);
      case 1: return Math.pow(2, 8 - (stage + 3) / 4);
      case 2: return Math.pow(2, 8 - (stage + 2) / 4);
      case 3: return Math.pow(2, 8 - (stage + 1) / 4) + Math.pow(2, 8 - (stage + 5) / 4) / 2;
    }
    return 0;
  }


  function isPowerOfTwo(number: number): boolean {
    if (number == 0) {
      return false;
    }

    while (number % 2 == 0) {
      number = number / 2;
    }
    return number === 1;
  }

  export function lastLooserStage(numberOfPlayersToRemain: number): TourneyDoubleEliminationStageType {
    return lastWinnerStage(numberOfPlayersToRemain) - 1;
  }

  export function numberOfPlayersInStartingStage(stage: TourneyDoubleEliminationStageType) {
    if (stage === TourneyDoubleEliminationStageType.Final) {
      return 2;
    }

    if (stage % 4 !== 0) {
      throw Error('In a double elimination tourney, it only makes sense to ask this for entry point stages.')
    }

    return Math.pow(2, 8 - stage / 4);
  }
}

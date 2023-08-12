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

export enum TourneyDoubleEliminationStageKind {
  LoserWithInjection = 3,
  Winner = 2,
  Loser = 1,
  Entry = 0,
}

export namespace TourneyDoubleEliminationStageType {
  const _stageStrings = [
    'Einstieg 256',
    'Verlierer Letzte 128-1',
    'Gewinner Letzte 128',
    'Verlierer Letzte 128-2',
    'Einstieg 128',
    'Verlierer Letzte 64-1',
    'Gewinner Letzte 64',
    'Verlierer Letzte 64-2',
    'Einstieg 64',
    'Verlierer Letzte 32-1',
    'Gewinner Letzte 32',
    'Verlierer Letzte 32-2',
    'Einstieg 32',
    'Verlierer Achtelfinale-1',
    'Gewinner Achtelfinale',
    'Verlierer Achtelfinale-2',
    'Einstieg 16',
    'Verlierer Viertelfinale-1',
    'Gewinner Viertelfinale',
    'Verlierer Viertelfinale-2',
    'Einstieg 8',
    'Verlierer Halbfinale-1',
    'Gewinner Halbfinale',
    'Verlierer Halbfinale-2',
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

  export function winnerAdvancesTo(stageType: TourneyDoubleEliminationStageType): TourneyDoubleEliminationStageType {
    return isEntryStage(stageType) || isLoserStage(stageType)
      ? stageType + 2
      : stageType + 4
  }

  export function loserAdvancesTo(stageType: TourneyDoubleEliminationStageType): TourneyDoubleEliminationStageType {
    return isEntryStage(stageType) || isWinnerStage(stageType)
      ? stageType + 1
      : NaN;
  }

  export function getWinnerStages(): TourneyDoubleEliminationStageType[] {
    return all()
      .filter(value => value < TourneyDoubleEliminationStageType.Final)
      .filter(value => isWinnerStage(value))
  }

  export function getLoserStages(): TourneyDoubleEliminationStageType[] {
    return all()
      .filter(value => value < TourneyDoubleEliminationStageType.Final)
      .filter(value => isLoserStage(value))
  }

  export function getStartingStages(): TourneyDoubleEliminationStageType[] {
    return all()
      .filter(value => value < TourneyDoubleEliminationStageType.Final)
      .filter(value => isEntryStage(value))
  }

  export function startingStage(numberOfPlayers: number): TourneyDoubleEliminationStageType {
    if (numberOfPlayers > 256) {
      throw Error(`${numberOfPlayers} is too many players for a double elimination tourney.`)
    }

    let entryStageType = TourneyDoubleEliminationStageType.Entry256;
    while (numberOfPlayersInStartingStage((entryStageType + 4) as TourneyDoubleEliminationStageType) >= numberOfPlayers) {
      entryStageType = entryStageType + 4;
    }

    return entryStageType;
  }

  export function lastWinnerStage(numberOfPlayersToRemain: number): TourneyDoubleEliminationStageType {
    if (numberOfPlayersToRemain <= 2) {
      return TourneyDoubleEliminationStageType.Final
    }

    let exitStageType = TourneyDoubleEliminationStageType.WinnerFinal;
    while (playersInStage(exitStageType) < numberOfPlayersToRemain) {
      exitStageType = exitStageType - 4;
    }

    return exitStageType;
  }

  export function playersInStage(stageType: TourneyDoubleEliminationStageType): number {
    switch (toStageKind(stageType)) {
      case TourneyDoubleEliminationStageKind.Entry:
        return Math.pow(2, 8 - stageType / 4);
      case TourneyDoubleEliminationStageKind.Loser:
        return Math.pow(2, 8 - (stageType + 3) / 4);
      case TourneyDoubleEliminationStageKind.Winner:
        return Math.pow(2, 8 - (stageType + 2) / 4);
      case TourneyDoubleEliminationStageKind.LoserWithInjection:
        return Math.pow(2, 8 - (stageType + 1) / 4);
      default:
        throw Error("Determining the number of players of the stageType ${stageType} is not implemented.")
    }
  }

  export function toStageKind(stageType: TourneyDoubleEliminationStageType): TourneyDoubleEliminationStageKind {
    switch (stageType % 4) {
      case 0: return TourneyDoubleEliminationStageKind.Entry;
      case 1: return TourneyDoubleEliminationStageKind.Loser;
      case 2: return TourneyDoubleEliminationStageKind.Winner;
      case 3: return TourneyDoubleEliminationStageKind.LoserWithInjection;
      default: throw Error("Something went wrong determining the stage kind from the stage type.")
    };
  }

  export function isWinnerStage(stageType: TourneyDoubleEliminationStageType): boolean {
    return toStageKind(stageType) === TourneyDoubleEliminationStageKind.Winner;
  }

  export function isLoserStage(stageType: TourneyDoubleEliminationStageType): boolean {
    const kind = toStageKind(stageType);
    return kind === TourneyDoubleEliminationStageKind.Loser
      || kind === TourneyDoubleEliminationStageKind.LoserWithInjection
  }

  export function isEntryStage(stageType: TourneyDoubleEliminationStageType): boolean {
    return toStageKind(stageType) === TourneyDoubleEliminationStageKind.Entry;
  }

  export function lastLoserStage(numberOfPlayersToRemain: number): TourneyDoubleEliminationStageType {
    return lastWinnerStage(numberOfPlayersToRemain) - 1;
  }

  export function numberOfPlayersInStartingStage(stageType: TourneyDoubleEliminationStageType): number {
    if (stageType === TourneyDoubleEliminationStageType.Final) {
      return 2;
    }

    if (!isEntryStage(stageType)) {
      throw Error('In a double elimination tourney, it only makes sense to ask this for entry point stages.')
    }

    return playersInStage(stageType);
  }
}

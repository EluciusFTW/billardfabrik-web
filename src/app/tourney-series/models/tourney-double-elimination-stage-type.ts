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
  LooserWithInjection = 3,
  Winner = 2,
  Looser = 1,
  Entry = 0,
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

  export function winnerAdvancesTo(stageType: TourneyDoubleEliminationStageType): TourneyDoubleEliminationStageType {
    return isEntryStage(stageType) || isLooserStage(stageType)
      ? stageType + 2
      : stageType + 4
  }

  export function looserAdvancesTo(stageType: TourneyDoubleEliminationStageType): TourneyDoubleEliminationStageType {
    return isEntryStage(stageType)
      ? stageType + 1
      : isWinnerStage(stageType)
        ? stageType - 1
        : NaN
  }

  export function getWinnerStages(): TourneyDoubleEliminationStageType[] {
    return all()
      .filter(value => value < TourneyDoubleEliminationStageType.Final)
      .filter(value => isWinnerStage(value))
  }

  export function getLooserStages(): TourneyDoubleEliminationStageType[] {
    return all()
      .filter(value => value < TourneyDoubleEliminationStageType.Final)
      .filter(value => isLooserStage(value))
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
    while (numberOfPlayersInStartingStage((entryStageType + 4) as TourneyDoubleEliminationStageType) > numberOfPlayers) {
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
    switch (stageType % 4) {
      case 0: return Math.pow(2, 8 - stageType / 4);
      case 1: return Math.pow(2, 8 - (stageType + 3) / 4);
      case 2: return Math.pow(2, 8 - (stageType + 2) / 4);
      case 3: return Math.pow(2, 8 - (stageType + 1) / 4) - Math.pow(2, 7 - (stageType + 5) / 4);
    }
    return 0;
  }

  export function toStageKind(stageType: TourneyDoubleEliminationStageType): TourneyDoubleEliminationStageKind {
    const remainder = stageType % 4;
    return remainder === 0
      ? TourneyDoubleEliminationStageKind.Entry
      : remainder === 2
        ? TourneyDoubleEliminationStageKind.Winner
        : TourneyDoubleEliminationStageKind.Looser
  }

  export function isWinnerStage(stageType: TourneyDoubleEliminationStageType): boolean {
    return toStageKind(stageType) === TourneyDoubleEliminationStageKind.Winner;
  }

  export function isLooserStage(stageType: TourneyDoubleEliminationStageType): boolean {
    const kind = toStageKind(stageType);
    return kind === TourneyDoubleEliminationStageKind.Looser
      || kind === TourneyDoubleEliminationStageKind.LooserWithInjection
  }

  export function isEntryStage(stageType: TourneyDoubleEliminationStageType): boolean {
    return toStageKind(stageType) === TourneyDoubleEliminationStageKind.Entry;
  }

  export function lastLooserStage(numberOfPlayersToRemain: number): TourneyDoubleEliminationStageType {
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

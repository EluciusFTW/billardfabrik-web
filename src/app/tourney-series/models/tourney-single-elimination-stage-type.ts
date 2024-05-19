// old: eight = 0, quarter = 1, semi = 2, third = 3, final = 4
export enum TourneyEliminationStageType {
  final = 0,
  thirdPlace = 1,
  semiFinal = 2,
  quarterFinal = 3,
  last16 = 4,
  last32 = 5,
  last64 = 6,
  last128 = 7,
  last256 = 8
}

export namespace TourneyEliminationStageType {
  const _stageStrings = [
    'Finale',
    'Spiel um Platz 3',
    'Halbfinale',
    'Viertelfinale',
    'Achtelfinale',
    'Letzte 32',
    'Letzte 64',
    'Letzte 128',
    'Letzte 256',
  ] as const;

  const _all = [
    TourneyEliminationStageType.last256,
    TourneyEliminationStageType.last128,
    TourneyEliminationStageType.last64,
    TourneyEliminationStageType.last32,
    TourneyEliminationStageType.last16,
    TourneyEliminationStageType.quarterFinal,
    TourneyEliminationStageType.semiFinal,
    TourneyEliminationStageType.thirdPlace,
    TourneyEliminationStageType.final
  ] as const;

  export function all(): TourneyEliminationStageType[] {
    return [ ... _all]
  }

  export function after(value: TourneyEliminationStageType): TourneyEliminationStageType {
    return value - 1;
  }

  export function map(stage: TourneyEliminationStageType) {
    return _stageStrings[stage]
  }

  export function numberOfPlayers(stage: TourneyEliminationStageType) {
    if (stage === TourneyEliminationStageType.final || stage === TourneyEliminationStageType.thirdPlace) {
      return 2;
    }

    return Math.pow(2, stage);
  }

  export function startingStage(numberOfPlayers: number) {
    let i = 1
    while (Math.pow(2, i) < numberOfPlayers) i++
    return _all[_all.length - i - 1];
  }

  export function numberOfMatches(value: TourneyEliminationStageType) {
    return numberOfPlayers(value) / 2;
  }
}

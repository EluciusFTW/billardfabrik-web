import { TourneyMode } from "../tourney-mode";

export enum TourneyPlacementType {
  First = 10,
  Second = 11,
  Third = 12,
  Fourth = 13,
  Last6 = 14,
  Last8 = 15,
  Last12 = 16,
  Last16 = 17,
  Last24 = 18,
  Last32 = 19,
  Last48 = 20,
  Last64 = 21,
  Last96 = 22,
  Last128 = 23,
  Last256 = 24,
  Group = 50,
}

export namespace TourneyPlacementType {
  export function map(placement: TourneyPlacementType, mode: TourneyMode): string {
    switch (placement) {
      case TourneyPlacementType.First:
        return 'Gewinner';
      case TourneyPlacementType.Second:
        return 'Zweiter';
      case TourneyPlacementType.Third:
        return 'Dritter';
      case TourneyPlacementType.Fourth:
        return 'Vierter';
      case TourneyPlacementType.Last6:
        return '5.-6. Platz';
      case TourneyPlacementType.Last8:
        return mode === 'Doppel-K.O.'
          ? '7.-8. Platz'
          : '5.-8.';
      case TourneyPlacementType.Last12:
        return '9.-12. Platz';
      case TourneyPlacementType.Last16:
        return mode === 'Doppel-K.O.'
          ? '13.-16. Platz'
          : '9.-16. Platz';
      case TourneyPlacementType.Last24:
        return '17.-24. Platz';
      case TourneyPlacementType.Last32:
        return mode === 'Doppel-K.O.'
          ? '25.-32. Platz'
          : '17.-32. Platz';
      case TourneyPlacementType.Last48:
        return '33.-48. Platz';
      case TourneyPlacementType.Last64:
        return mode === 'Doppel-K.O.'
          ? '49.-64. Platz'
          : '33.-64. Platz';
      case TourneyPlacementType.Last96:
        return '65.-96. Platz';
      case TourneyPlacementType.Last128:
        return mode === 'Doppel-K.O.'
          ? '65.-128. Platz'
          : '97.-128. Platz';
      case TourneyPlacementType.Last256:
        return '129.-256. Platz';
      case TourneyPlacementType.Group:
        return 'Gruppenphase';
      default:
        return 'Unbekannte Plazierung';
    }
  }
}

import { Injectable } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyPlacementType, TourneyPlacementTypeOld } from '../../models/evaluation/tourney-placement-type';

@Injectable()
export class TourneyPointsService {

  public calculate(tourney: Tourney, placement: TourneyPlacementType): number {
    const numberOfGroups = tourney.groups.length;
    if(![1,2,4,8].includes(numberOfGroups)){
      throw new Error("Can't calculate points when there are " + numberOfGroups + " groups.");
    }

    switch (placement) {
      case TourneyPlacementType.Group: return 1;
      case TourneyPlacementType.Last16: return 3;
      case TourneyPlacementType.Last8:
        return numberOfGroups === 8
          ? 4
          : 3;
      case TourneyPlacementType.Fourth:
        return numberOfGroups === 8
          ? 5
          : numberOfGroups === 4
            ? 4
            : 3;
      case TourneyPlacementType.Third:
        return numberOfGroups === 8
          ? 6
          : numberOfGroups === 4
            ? 5
            : 4;
      case TourneyPlacementType.Second:
        return numberOfGroups === 8
          ? 8
          : numberOfGroups === 4
            ? 6
            : numberOfGroups === 2
              ? 5
              : 3;
      case TourneyPlacementType.First:
        return numberOfGroups === 8
          ? 10
          : numberOfGroups === 4
            ? 8
            : numberOfGroups === 2
              ? 6
              : 5;

      default: throw new Error("Can't calculate points of this placement type.")
    }
  }
}

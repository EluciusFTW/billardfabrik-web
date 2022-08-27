import { Injectable } from '@angular/core';
import { Tourney } from '../models/tourney';
import { TourneyPlacementType } from '../models/evaluation/tourney-placement-type';

@Injectable()
export class TourneyPointsService {

  public calculate(tourney: Tourney, placement: TourneyPlacementType): number {
    const numberOfGroups = tourney.groups.length;
    if(![1,2,4,8].includes(numberOfGroups)){
      throw new Error("Can't calculate points when there are " + numberOfGroups + " groups.");
    }

    switch (placement) {
      case TourneyPlacementType.GroupStage: return 1;
      case TourneyPlacementType.EigthFinal: return 3;
      case TourneyPlacementType.QuarterFinal:
        return numberOfGroups === 8
          ? 4
          : 3;
      case TourneyPlacementType.FourthPlace:
        return numberOfGroups === 8
          ? 5
          : numberOfGroups === 4
            ? 4
            : 3;
      case TourneyPlacementType.ThirdPlace:
        return numberOfGroups === 8
          ? 6
          : numberOfGroups === 4
            ? 5
            : 4;
      case TourneyPlacementType.RunnerUp:
        return numberOfGroups === 8
          ? 8
          : numberOfGroups === 4
            ? 6
            : numberOfGroups === 2
              ? 5
              : 3;
      case TourneyPlacementType.Winner:
        return numberOfGroups === 8
          ? 10
          : numberOfGroups === 4
            ? 8
            : numberOfGroups === 2
              ? 6
              : 5;
    }
  }
}

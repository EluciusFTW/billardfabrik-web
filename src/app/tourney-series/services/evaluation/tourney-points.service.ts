import { Injectable } from '@angular/core';
import { TourneyPlacementType } from '../../models/evaluation/tourney-placement-type';

@Injectable()
export class TourneyPointsService {

  public calculate(numberOfPlayers: number, placement: TourneyPlacementType): number {
    if(numberOfPlayers > 32) {
      throw new Error('This service only calculates the points up to 32 players.')
    }
    const points = this.calculateSingleNew(numberOfPlayers, placement);

    console.log('Placement: ', placement);
    console.log('Points: ', points);

    return points;
  }

  private calculateSingleNew(numberOfPlayers: number, placement: TourneyPlacementType): number {
    if (placement === TourneyPlacementType.Group) return 1;

    return numberOfPlayers >= 24
      ? this.pointsFor24Plus(placement)
      : numberOfPlayers >= 12
        ? this.pointsFor12Plus(placement)
        : numberOfPlayers >= 7
          ? this.pointsFor7Plus(placement)
          : this.pointsFor6Minus(placement)
  }

  private pointsFor6Minus(placement: TourneyPlacementType): number {
    switch (placement) {
      case TourneyPlacementType.Last6: return 1;
      case TourneyPlacementType.Fourth: return 2;
      case TourneyPlacementType.Third: return 2;
      case TourneyPlacementType.Second: return 3;
      case TourneyPlacementType.First: return 5;
      default: throw new Error("Can't calculate points of this placement type.")
    }
  }

  private pointsFor7Plus(placement: TourneyPlacementType): number {
    switch (placement) {
      case TourneyPlacementType.Last8:
      case TourneyPlacementType.Last6: return 1;
      case TourneyPlacementType.Fourth: return 3;
      case TourneyPlacementType.Third: return 4;
      case TourneyPlacementType.Second: return 5;
      case TourneyPlacementType.First: return 6;
      default: throw new Error("Can't calculate points of this placement type.")
    }
  }

  private pointsFor12Plus(placement: TourneyPlacementType): number {
    switch (placement) {
      case TourneyPlacementType.Last24:
      case TourneyPlacementType.Last16:
      case TourneyPlacementType.Last12: return 1;
      case TourneyPlacementType.Last8:
      case TourneyPlacementType.Last6: return 3;
      case TourneyPlacementType.Fourth: return 4;
      case TourneyPlacementType.Third: return 5;
      case TourneyPlacementType.Second: return 6;
      case TourneyPlacementType.First: return 8;
      default: throw new Error("Can't calculate points of this placement type.")
    }
  }

  private pointsFor24Plus(placement: TourneyPlacementType): number {
    switch (placement) {
      case TourneyPlacementType.Last32:
      case TourneyPlacementType.Last24:
      case TourneyPlacementType.Last16:
      case TourneyPlacementType.Last12: return 3;
      case TourneyPlacementType.Last8:
      case TourneyPlacementType.Last6: return 4;
      case TourneyPlacementType.Fourth: return 5;
      case TourneyPlacementType.Third: return 6;
      case TourneyPlacementType.Second: return 8;
      case TourneyPlacementType.First: return 10;
      default: throw new Error("Can't calculate points of this placement type.")
    }
  }
}

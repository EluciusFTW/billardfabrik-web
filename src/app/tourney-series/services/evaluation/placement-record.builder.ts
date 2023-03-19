import { Injectable } from "@angular/core";
import { PlacementRecord } from "../../models/evaluation/placement-record";
import { TourneyPlacementType } from "../../models/evaluation/tourney-placement-type";
import { Tourney } from "../../models/tourney";
import { TourneyFunctions } from "../../tourney/tourney-functions";
import { EvaluationFunctions } from "./evaluation-functions";
import { TourneyPointsService } from "./tourney-points.service";

@Injectable()
export class PlacementRecordBuilder {

  constructor(private readonly pointsService: TourneyPointsService) { }

  public Build(tourney: Tourney, placement: TourneyPlacementType): PlacementRecord {
    return {
      discipline: tourney.meta.discipline,
      placement: placement,
      tourney: EvaluationFunctions.getTourneyName(tourney.meta),
      points: this.pointsService.calculate(TourneyFunctions.GetPlayerCount(tourney), placement)
    }
  }
}

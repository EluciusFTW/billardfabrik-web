import { Injectable } from "@angular/core";
import { PlacementRecord } from "../../models/evaluation/placement-record";
import { Tourney } from "../../models/tourney";
import { TourneyMode } from "../../models/tourney-mode";
import { TourneyDoubleEliminationPlacementsService } from "./tourney-double-elimination-placement.service";
import { TourneySingleEliminationPlacementsService } from "./tourney-single-elimination-placements.service";

@Injectable()
export class TourneyPlacementsService {

  constructor(
    private readonly singleEliminationService: TourneySingleEliminationPlacementsService,
    private readonly doubleEliminationService: TourneyDoubleEliminationPlacementsService) { }

  public Evaluate(tourney: Tourney): Map<string, PlacementRecord> {
    return tourney.meta.modus === TourneyMode.GroupsThenSingleElimination
      ? this.singleEliminationService.Evaluate(tourney)
      : this.doubleEliminationService.Evaluate(tourney);
  }
}

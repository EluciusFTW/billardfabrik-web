import { Injectable } from "@angular/core";
import { PlacementRecord } from "../../models/evaluation/placement-record";
import { Tourney } from "../../models/tourney";
import { TourneyMode } from "../../models/tourney-mode";
import { GroupStagePlacementsService } from "./group-stage-placements.service";
import { SingleEliminationStagePlacementsService } from "./single-elimination-stage-placements.service";

@Injectable()
export class TourneySingleEliminationPlacementsService {
  constructor(
    private readonly groupStageService: GroupStagePlacementsService,
    private readonly singleEliminationStageService: SingleEliminationStagePlacementsService) { }

  public Evaluate(tourney: Tourney): Map<string, PlacementRecord> {
    if (tourney.meta.modus !== TourneyMode.GroupsThenSingleElimination) {
      throw new Error("This service expects a single elimination tourney.")
    }

    const records = new Map<string, PlacementRecord>();
    this.groupStageService.Add(tourney, records);
    this.singleEliminationStageService.Add(tourney, records);

    return records;
  }
}

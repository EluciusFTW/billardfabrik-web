import { Injectable } from "@angular/core";
import { PlacementRecord } from "../../models/evaluation/placement-record";
import { Tourney } from "../../models/tourney";
import { TourneyMode } from "../../models/tourney-mode";
import { SingleEliminationStagePlacementsService } from "./stages/single-elimination-stage-placements.service";

@Injectable()
export class TourneyDoubleEliminationPlacementsService {

  constructor(private readonly singleEliminationStageService: SingleEliminationStagePlacementsService) { }

  public Evaluate(tourney: Tourney): Map<string, PlacementRecord> {
    if (tourney.meta.modus !== TourneyMode.DoubleElimination) {
      throw new Error("This service expects a single elimination tourney.")
    }

    const records = new Map<string, PlacementRecord>();

    this.singleEliminationStageService.Add(tourney, records);

    return records;
  }
}

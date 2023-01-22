import { Injectable } from "@angular/core";
import { PlacementRecord } from "../../models/evaluation/placement-record";
import { Tourney } from "../../models/tourney";
import { TourneyMode } from "../../models/tourney-mode";

@Injectable()
export class TourneyDoubleEliminationPlacementsService {
  public Evaluate(tourney: Tourney): Map<string, PlacementRecord> {
    if (tourney.meta.modus !== TourneyMode.DoubleElimination) {
      throw new Error("This service expects a single elimination tourney.")
    }

    const result = new Map<string, PlacementRecord>();

    return result;
  }
}

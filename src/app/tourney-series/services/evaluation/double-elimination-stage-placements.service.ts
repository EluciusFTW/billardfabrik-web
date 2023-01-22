import { Injectable } from "@angular/core";
import { PlacementRecord } from "../../models/evaluation/placement-record";
import { Tourney } from "../../models/tourney";

@Injectable()
export class DoubleEliminationStagePlacementsService {

  public Add(tourney: Tourney, results: Map<string, PlacementRecord>): void {}

}

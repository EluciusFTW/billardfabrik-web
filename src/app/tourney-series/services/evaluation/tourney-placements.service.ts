import { Injectable } from "@angular/core";
import { PlacementRecord } from "../../models/evaluation/placement-record";
import { Tourney } from "../../models/tourney";
import { DoubleEliminationStagePlacementsService } from "./stages/double-elimination-stage-placements.service";
import { GroupStagePlacementsService } from "./stages/group-stage-placements.service";
import { SingleEliminationStagePlacementsService } from "./stages/single-elimination-stage-placements.service";

@Injectable()
export class TourneyPlacementsService {

  constructor(
    private readonly groupStagePlacementsService: GroupStagePlacementsService,
    private readonly singleEliminationStageService: SingleEliminationStagePlacementsService,
    private readonly doubleEliminationStageService: DoubleEliminationStagePlacementsService) { }

  public Evaluate(tourney: Tourney): Map<string, PlacementRecord> {
    const records = new Map<string, PlacementRecord>();
    this.groupStagePlacementsService.Add(tourney, records);
    this.doubleEliminationStageService.Add(tourney, records);
    this.singleEliminationStageService.Add(tourney, records);

    return records;
  }
}

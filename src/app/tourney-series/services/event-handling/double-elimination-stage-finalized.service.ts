import { Injectable } from "@angular/core";
import { Tourney } from "../../models/tourney";
import { TourneyDoubleEliminationStageType } from "../../models/tourney-double-elimination-stage-type";

@Injectable()
export class DoubleEliminationStageFinalizedService {

  handle(tourney: Tourney, stage: TourneyDoubleEliminationStageType): void {

  }
}

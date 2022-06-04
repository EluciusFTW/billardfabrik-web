import { Injectable } from "@angular/core";
import { Tourney } from "../../models/tourney";
import { TourneyDoubleEliminationStageType } from "../../models/tourney-double-elimination-stage-type";
import { DoubleEliminationEliminationStage } from "../../models/tourney-elimination-stage";
import { TourneyPhaseStatus } from "../../models/tourney-phase-status";

@Injectable()
export class DoubleEliminationStageFinalizedService {

  handle(tourney: Tourney, finalizedStageType: TourneyDoubleEliminationStageType): void {
    const stage = this.getStage(tourney, finalizedStageType);
  }

  private getStage(tourney: Tourney, stageType: TourneyDoubleEliminationStageType): DoubleEliminationEliminationStage {
    const stage = tourney.doubleEliminationStages.find(stage => stage.type === stageType);
    if (!stage) {
      throw Error(`Cannot finalize a stage of type ${stageType}, because the tourney has none.`);
    }
    if (stage.status !== TourneyPhaseStatus.finalized) {
      throw Error(`Cannot process finalization event because the stage ${stageType} is not finalized.`);
    }
    return stage;
  }
}

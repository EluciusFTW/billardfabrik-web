import { Injectable } from "@angular/core";
import { TourneyPlacementType } from "src/app/tourney-series/models/evaluation/tourney-placement-type";
import { TourneyDoubleEliminationStageType } from "src/app/tourney-series/models/tourney-double-elimination-stage-type";
import { TourneyPhaseStatus } from "src/app/tourney-series/models/tourney-phase-status";
import { PlacementRecord } from "../../../models/evaluation/placement-record";
import { Tourney } from "../../../models/tourney";
import { PlacementRecordBuilder } from "../placement-record.builder";
import { EvaluationFunctions } from "../evaluation-functions";

@Injectable()
export class DoubleEliminationStagePlacementsService {

  constructor(private readonly recordBuilder: PlacementRecordBuilder) { }

  public Add(tourney: Tourney, results: Map<string, PlacementRecord>): void {
    (tourney.doubleEliminationStages ?? [] )
      .filter(stage => stage.status === TourneyPhaseStatus.finalized)
      .filter(stage => TourneyDoubleEliminationStageType.isLoserStage(stage.type))
      .forEach(stage => {
          const placement = this.getPlacementRecord(tourney, stage.type);
          EvaluationFunctions
            .getLosers(stage)
            .forEach(loser => results.set(loser, placement));
      })
  }

  private getPlacementRecord(tourney: Tourney, stageType: TourneyDoubleEliminationStageType){
    const placement = this.MapStageLoserToPlacement(stageType);
    return this.recordBuilder.Build(tourney, placement);
  }

  private MapStageLoserToPlacement(type: TourneyDoubleEliminationStageType): TourneyPlacementType {
    switch (type) {
      case TourneyDoubleEliminationStageType.LoserLast128: return TourneyPlacementType.Last256;
      case TourneyDoubleEliminationStageType.LoserLast96: return TourneyPlacementType.Last128;
      case TourneyDoubleEliminationStageType.LoserLast64: return TourneyPlacementType.Last96;
      case TourneyDoubleEliminationStageType.LoserLast48: return TourneyPlacementType.Last64;
      case TourneyDoubleEliminationStageType.LoserLast32: return TourneyPlacementType.Last48;
      case TourneyDoubleEliminationStageType.LoserLast24: return TourneyPlacementType.Last32;
      case TourneyDoubleEliminationStageType.LoserLast16: return TourneyPlacementType.Last24;
      case TourneyDoubleEliminationStageType.LoserLast12: return TourneyPlacementType.Last16;
      case TourneyDoubleEliminationStageType.LoserQuareterFinal: return TourneyPlacementType.Last16;
      case TourneyDoubleEliminationStageType.LoserLast6: return TourneyPlacementType.Last12;
      case TourneyDoubleEliminationStageType.LoserSemiFinal: return TourneyPlacementType.Last8;
      case TourneyDoubleEliminationStageType.LoserLast3: return TourneyPlacementType.Last6;
      case TourneyDoubleEliminationStageType.LoserFinal: return TourneyPlacementType.Fourth;

      default: throw new Error(`The stage type ${type} cannot be mapped to a placement type.`);
    }
  }
}


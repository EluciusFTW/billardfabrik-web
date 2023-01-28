import { Injectable } from "@angular/core";
import { TourneyEliminationStage } from "src/app/tourney-series/models/tourney-elimination-stage";
import { PlacementRecord } from "../../../models/evaluation/placement-record";
import { TourneyPlacementType } from "../../../models/evaluation/tourney-placement-type";
import { MatchStatus } from "../../../models/match-status";
import { Tourney } from "../../../models/tourney";
import { TourneyPhaseStatus } from "../../../models/tourney-phase-status";
import { TourneyEliminationStageType } from "../../../models/tourney-single-elimination-stage-type";
import { EvaluationFunctions as EvaluationFunctions } from "../evaluation-functions";
import { PlacementRecordBuilder } from "../placement-record.builder";

@Injectable()
export class SingleEliminationStagePlacementsService {

  relevantStagesForTourneyRecords = [
    TourneyEliminationStageType.final,
    TourneyEliminationStageType.thirdPlace,
    TourneyEliminationStageType.quarterFinal,
    TourneyEliminationStageType.last16
  ];

  constructor(private readonly recordBuilder: PlacementRecordBuilder) { }

  public Add(tourney: Tourney, results: Map<string, PlacementRecord>): void {
    (tourney.eliminationStages ?? [])
      .filter(stage => stage.status === TourneyPhaseStatus.finalized)
      .filter(stage => this.relevantStagesForTourneyRecords.find(i => i === stage.type) + 1)
      .forEach(stage => {
        const placement = this.getLoserPlacement(tourney, stage.type);
        EvaluationFunctions
          .getLosers(stage)
          .forEach(loser => results.set(loser, placement));

        if(stage.type === TourneyEliminationStageType.thirdPlace || stage.type === TourneyEliminationStageType.final) {
          stage.matches
          .filter(match => match.status === MatchStatus.done)
          .forEach(match => {
              const winner = match.playerOne.points === match.length
                ? match.playerOne.name
                : match.playerTwo.name;
              const placement = this.getWinnerPlacement(tourney, stage.type);
              results.set(winner, placement);
            }
          );
        }
      })
  }

  private getLoserPlacement(tourney: Tourney, stageType: TourneyEliminationStageType){
    const placement = this.MapStageLoserToPlacement(stageType);
    return this.recordBuilder.Build(tourney, placement);
  }

  private getWinnerPlacement(tourney: Tourney, stageType: TourneyEliminationStageType){
    const placement = this.MapStageWinnerToPlacement(stageType);
    return this.recordBuilder.Build(tourney, placement);
  }

  private MapStageWinnerToPlacement(type: TourneyEliminationStageType) {
    switch (type) {
      case TourneyEliminationStageType.thirdPlace: return TourneyPlacementType.Third;
      case TourneyEliminationStageType.final: return TourneyPlacementType.First;
      default: throw Error;
    }
  }

  private MapStageLoserToPlacement(type: TourneyEliminationStageType): TourneyPlacementType {
    switch (type) {
      case TourneyEliminationStageType.last16: return TourneyPlacementType.Last16;
      case TourneyEliminationStageType.quarterFinal: return TourneyPlacementType.Last8;
      case TourneyEliminationStageType.thirdPlace: return TourneyPlacementType.Fourth;
      case TourneyEliminationStageType.final: return TourneyPlacementType.Second;
      default: throw new Error("The stage type cannot be mapped to a placement type.")
    }
  }
}

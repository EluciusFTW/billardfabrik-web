import { Injectable } from "@angular/core";
import { PlacementRecord } from "../../models/evaluation/placement-record";
import { TourneyPlacementType } from "../../models/evaluation/tourney-placement-type";
import { MatchStatus } from "../../models/match-status";
import { Tourney } from "../../models/tourney";
import { TourneyPhaseStatus } from "../../models/tourney-phase-status";
import { TourneyEliminationStageType } from "../../models/tourney-single-elimination-stage-type";
import { PlacementRecordBuilder } from "./placement-record.builder";

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
    tourney.eliminationStages
      .filter(stage => stage.status === TourneyPhaseStatus.finalized)
      .filter(stage => this.relevantStagesForTourneyRecords.find(i => i === stage.type) + 1)
      .forEach(stage => {
        stage.matches
          .filter(match => match.status === MatchStatus.done || match.status === MatchStatus.cancelled)
          .forEach(match => {
            const looserPlacement = this.MapStageLooserToPlacement(stage.type);
            const looserRecord = this.recordBuilder.Build(tourney, looserPlacement);
            const loosers = match.status === MatchStatus.done
              ? match.playerOne.points === match.length
                ? [match.playerTwo.name]
                : [match.playerOne.name]
              : [match.playerOne.name, match.playerTwo.name];
            loosers.forEach(looser => results.set(looser, looserRecord));

            if (match.status === MatchStatus.done
              && (stage.type === TourneyEliminationStageType.thirdPlace || stage.type === TourneyEliminationStageType.final)) {
              const winner = match.playerOne.points === match.length
                ? match.playerOne.name
                : match.playerTwo.name;

              const winnerPlacement = this.MapStageWinnerToPlacement(stage.type);
              results.set(winner, this.recordBuilder.Build(tourney, winnerPlacement));
            }
          })
      })
  }

  private MapStageWinnerToPlacement(type: TourneyEliminationStageType) {
    switch (type) {
      case TourneyEliminationStageType.thirdPlace: return TourneyPlacementType.ThirdPlace;
      case TourneyEliminationStageType.final: return TourneyPlacementType.Winner;
      default: throw Error;
    }
  }

  private MapStageLooserToPlacement(type: TourneyEliminationStageType): TourneyPlacementType {
    switch (type) {
      case TourneyEliminationStageType.last16: return TourneyPlacementType.EigthFinal;
      case TourneyEliminationStageType.quarterFinal: return TourneyPlacementType.QuarterFinal;
      case TourneyEliminationStageType.thirdPlace: return TourneyPlacementType.FourthPlace;
      case TourneyEliminationStageType.final: return TourneyPlacementType.RunnerUp;
      default: throw new Error("The stage type cannot be mapped to a placement type.")
    }
  }
}

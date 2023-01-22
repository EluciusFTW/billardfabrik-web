import { Injectable } from "@angular/core";
import { PlacementRecord } from "../../../models/evaluation/placement-record";
import { Tourney } from "../../../models/tourney";

@Injectable()
export class DoubleEliminationStagePlacementsService {

  public Add(tourney: Tourney, results: Map<string, PlacementRecord>): void {

    // (tourney.doubleEliminationStages ?? [] )
    //   .filter(stage => stage.status === TourneyPhaseStatus.finalized)
    //   .filter(stage => this.relevantStagesForTourneyRecords.find(i => i === stage.type) + 1)
    //   .forEach(stage => {
    //     stage.matches
    //       .filter(match => match.status === MatchStatus.done || match.status === MatchStatus.cancelled)
    //       .forEach(match => {
    //         const looserPlacement = this.MapStageLooserToPlacement(stage.type);
    //         const looserRecord = this.recordBuilder.Build(tourney, looserPlacement);
    //         const loosers = match.status === MatchStatus.done
    //           ? match.playerOne.points === match.length
    //             ? [match.playerTwo.name]
    //             : [match.playerOne.name]
    //           : [match.playerOne.name, match.playerTwo.name];
    //         loosers.forEach(looser => results.set(looser, looserRecord));

    //         if (match.status === MatchStatus.done
    //           && (stage.type === TourneyEliminationStageType.thirdPlace || stage.type === TourneyEliminationStageType.final)) {
    //           const winner = match.playerOne.points === match.length
    //             ? match.playerOne.name
    //             : match.playerTwo.name;

    //           const winnerPlacement = this.MapStageWinnerToPlacement(stage.type);
    //           results.set(winner, this.recordBuilder.Build(tourney, winnerPlacement));
    //         }
    //       })
    //   })
  }

}

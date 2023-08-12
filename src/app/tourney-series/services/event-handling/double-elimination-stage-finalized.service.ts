import { Injectable } from "@angular/core";
import { Match } from "../../models/match";
import { MatchPlayer } from "../../models/match-player";
import { Tourney } from "../../models/tourney";
import { TourneyDoubleEliminationStageKind, TourneyDoubleEliminationStageType } from "../../models/tourney-double-elimination-stage-type";
import { DoubleEliminationEliminationStage, TourneyEliminationStage } from "../../models/tourney-elimination-stage";
import { TourneyPhaseStatus } from "../../models/tourney-phase-status";
import { SingleEliminationStagePlacementsService } from "../evaluation/stages/single-elimination-stage-placements.service";
import { TourneyEliminationStageType } from "../../models/tourney-single-elimination-stage-type";

@Injectable()
export class DoubleEliminationStageFinalizedService {

  handle(tourney: Tourney, finalizedStageType: TourneyDoubleEliminationStageType): void {
    const stage = this.getStage(tourney, finalizedStageType);
    const stageKind = TourneyDoubleEliminationStageType.toStageKind(finalizedStageType);

    let winners = stage.matches.map(match => MatchPlayer.From(Match.winner(match).name));
    let losers = stage.matches.map(match => MatchPlayer.From(Match.loser(match).name));

    const nextStageForWinners = this.tryGetStage(tourney, TourneyDoubleEliminationStageType.winnerAdvancesTo(finalizedStageType));
    if (nextStageForWinners) {
      switch (stageKind) {
        case TourneyDoubleEliminationStageKind.Entry:
        case TourneyDoubleEliminationStageKind.Winner:
          nextStageForWinners.matches.forEach((match, index) => {
            match.playerOne = winners[2 * index]
            match.playerTwo = winners[2 * index + 1]
          });
          break;
        case TourneyDoubleEliminationStageKind.Loser:
          nextStageForWinners.matches.forEach((match, index) => {
            match.playerTwo = winners[index]
          });
          break;
        case TourneyDoubleEliminationStageKind.LoserWithInjection:
          nextStageForWinners.matches.forEach((match, index) => {
            match.playerOne = winners[2 * index]
            match.playerTwo = winners[2 * index + 1]
          });
          break;
      }
    }

    const nextStageForLosers = this.tryGetStage(tourney, TourneyDoubleEliminationStageType.loserAdvancesTo(finalizedStageType));
    if (nextStageForLosers) {
      switch (stageKind) {
        case TourneyDoubleEliminationStageKind.Entry:
          nextStageForLosers.matches.forEach((match, index) => {
            match.playerOne = losers[2 * index]
            match.playerTwo = losers[2 * index + 1]
          });
          break;
        case TourneyDoubleEliminationStageKind.Winner:
          // const firstHalf = losers.slice(0, losers.length / 2);
          // const secondHalf = losers.slice(losers.length / 2, losers.length);
          // const reorderedLosers = secondHalf.concat(firstHalf);
          // nextStageForLosers.matches.forEach((match, index) => match.playerOne = reorderedLosers[index]);
          losers.reverse()
          nextStageForLosers.matches.forEach((match, index) => match.playerOne = losers[index]);
          break;
        case TourneyDoubleEliminationStageKind.Loser:
          break;
      }
    }

    // If there is no next stages in the double elimination phase,
    // then the winners advance to the single elimination phase and the current phase is completed
    if (nextStageForWinners) {
      this.setStatus(nextStageForWinners);
    } else {
      this.populateSingleEliminationStage(tourney, stageKind, finalizedStageType, winners, losers);
      stage.status = TourneyPhaseStatus.finalized;
    }

    if (nextStageForLosers) {
      this.setStatus(nextStageForLosers);
    }
  }

  private populateSingleEliminationStage(tourney: Tourney, stageKind: TourneyDoubleEliminationStageKind, finalizedStageType: TourneyDoubleEliminationStageType, winners: MatchPlayer[], losers: MatchPlayer[]) {
    if (finalizedStageType === TourneyDoubleEliminationStageType.WinnerFinal || finalizedStageType === TourneyDoubleEliminationStageType.LoserFinal) {
      const final = tourney.eliminationStages.find(stage => stage.type === TourneyEliminationStageType.final)
      const thirdPlace = tourney.eliminationStages.find(stage => stage.type === TourneyEliminationStageType.thirdPlace)
      stageKind === TourneyDoubleEliminationStageKind.Winner
        ? final.matches[0].playerOne = winners[0]
        : final.matches[0].playerTwo = winners[0]

      stageKind === TourneyDoubleEliminationStageKind.Winner
        ? thirdPlace.matches[0].playerOne = losers[0]
        : thirdPlace.matches[0].playerTwo = losers[0]

      this.setStatus(final);
      this.setStatus(thirdPlace);
    } else {
      const eliminationStage = tourney.eliminationStages[0];
        eliminationStage.matches
          .forEach((match, index) => stageKind === TourneyDoubleEliminationStageKind.Winner
            ? match.playerOne = winners[index]
            : match.playerTwo = winners[index]);
        this.setStatus(eliminationStage);
    }
  }

  private setStatus(nextStage: TourneyEliminationStage) {
    if (this.stageFullySeeded(nextStage)) {
      nextStage.status = TourneyPhaseStatus.readyOrOngoing;
    }
  }

  private stageFullySeeded(stage: TourneyEliminationStage): Boolean {
    return !stage.matches
      .flatMap(match => [match.playerOne, match.playerTwo])
      .map(player => !MatchPlayer.isDetermined(player))
      .some(value => value);
  }

  private getStage(tourney: Tourney, stageType: TourneyDoubleEliminationStageType): DoubleEliminationEliminationStage {
    const stage = this.tryGetStage(tourney, stageType);

    if (!stage) {
      throw Error(`Cannot finalize a stage of type ${stageType}, because the tourney has none.`);
    }
    if (stage.status !== TourneyPhaseStatus.finalized) {
      throw Error(`Cannot process finalization event because the stage ${stageType} is not finalized.`);
    }
    return stage;
  }

  private tryGetStage(tourney: Tourney, stageType: TourneyDoubleEliminationStageType): DoubleEliminationEliminationStage {
    return tourney.doubleEliminationStages.find(stage => stage.type === stageType);
  }
}

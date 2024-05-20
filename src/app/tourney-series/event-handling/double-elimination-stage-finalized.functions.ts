import { Match } from "../models/match";
import { MatchPlayer } from "../models/match-player";
import { Tourney } from "../models/tourney";
import { TourneyDoubleEliminationStageKind, TourneyDoubleEliminationStageType } from "../models/tourney-double-elimination-stage-type";
import { DoubleEliminationEliminationStage, TourneyEliminationStage } from "../models/tourney-elimination-stage";
import { TourneyPhaseStatus } from "../models/tourney-phase-status";
import { TourneyEliminationStageType } from "../models/tourney-single-elimination-stage-type";

export class DoubleEliminationStageFinalizedFunctions {

  static handle(tourney: Tourney, finalizedStageType: TourneyDoubleEliminationStageType): void {
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
            Match.setPlayerOne(match, winners[2 * index]);
            Match.setPlayerTwo(match, winners[2 * index + 1]);
          });
          break;
        case TourneyDoubleEliminationStageKind.Loser:
          nextStageForWinners.matches.forEach((match, index) => {
            Match.setPlayerTwo(match, winners[index])
          });
          break;
        case TourneyDoubleEliminationStageKind.LoserWithInjection:
          nextStageForWinners.matches.forEach((match, index) => {
            Match.setPlayerOne(match, winners[2 * index]);
            Match.setPlayerTwo(match, winners[2 * index + 1]);
          });
          break;
      }
    }

    const nextStageForLosers = this.tryGetStage(tourney, TourneyDoubleEliminationStageType.loserAdvancesTo(finalizedStageType));
    if (nextStageForLosers) {
      switch (stageKind) {
        case TourneyDoubleEliminationStageKind.Entry:
          nextStageForLosers.matches.forEach((match, index) => {
            Match.setPlayerOne(match, losers[2 * index]);
            Match.setPlayerTwo(match, losers[2 * index + 1]);
          });
          break;
        case TourneyDoubleEliminationStageKind.Winner:
          losers.reverse()
          nextStageForLosers.matches.forEach((match, index) => Match.setPlayerOne(match, losers[index]));
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

  private static populateSingleEliminationStage(tourney: Tourney, stageKind: TourneyDoubleEliminationStageKind, finalizedStageType: TourneyDoubleEliminationStageType, winners: MatchPlayer[], losers: MatchPlayer[]) {
    if (finalizedStageType === TourneyDoubleEliminationStageType.WinnerFinal || finalizedStageType === TourneyDoubleEliminationStageType.LoserFinal) {
      const final = tourney.eliminationStages.find(stage => stage.type === TourneyEliminationStageType.final)
      const thirdPlace = tourney.eliminationStages.find(stage => stage.type === TourneyEliminationStageType.thirdPlace)
      stageKind === TourneyDoubleEliminationStageKind.Winner
        ? Match.setPlayerOne(final.matches[0], winners[0])
        : Match.setPlayerTwo(final.matches[0], winners[0])

      stageKind === TourneyDoubleEliminationStageKind.Winner
        ? Match.setPlayerOne(thirdPlace.matches[0], losers[0])
        : Match.setPlayerTwo(thirdPlace.matches[0], losers[0])

      this.setStatus(final);
      this.setStatus(thirdPlace);
    } else {
      const eliminationStage = tourney.eliminationStages[0];
        eliminationStage.matches.forEach((match, index) =>
          stageKind === TourneyDoubleEliminationStageKind.Winner
            ? Match.setPlayerOne(match, winners[index])
            : Match.setPlayerTwo(match, winners[index]));
        this.setStatus(eliminationStage);
    }
  }

  private static setStatus(nextStage: TourneyEliminationStage) {
    if (this.stageFullySeeded(nextStage)) {
      nextStage.status = TourneyPhaseStatus.readyOrOngoing;
    }
  }

  private static stageFullySeeded(stage: TourneyEliminationStage): Boolean {
    return !stage.matches
      .flatMap(match => [match.playerOne, match.playerTwo])
      .map(player => !MatchPlayer.isDetermined(player))
      .some(value => value);
  }

  private static getStage(tourney: Tourney, stageType: TourneyDoubleEliminationStageType): DoubleEliminationEliminationStage {
    const stage = this.tryGetStage(tourney, stageType);

    if (!stage) {
      throw Error(`Cannot finalize a stage of type ${stageType}, because the tourney has none.`);
    }
    if (stage.status !== TourneyPhaseStatus.finalized) {
      throw Error(`Cannot process finalization event because the stage ${stageType} is not finalized.`);
    }
    return stage;
  }

  private static tryGetStage(tourney: Tourney, stageType: TourneyDoubleEliminationStageType): DoubleEliminationEliminationStage {
    return tourney.doubleEliminationStages.find(stage => stage.type === stageType);
  }
}

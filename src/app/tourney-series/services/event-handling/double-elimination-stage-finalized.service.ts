import { Injectable } from "@angular/core";
import { Match } from "../../models/match";
import { MatchPlayer } from "../../models/match-player";
import { Tourney } from "../../models/tourney";
import { TourneyDoubleEliminationStageKind, TourneyDoubleEliminationStageType } from "../../models/tourney-double-elimination-stage-type";
import { DoubleEliminationEliminationStage, TourneyEliminationStage } from "../../models/tourney-elimination-stage";
import { TourneyPhaseStatus } from "../../models/tourney-phase-status";

@Injectable()
export class DoubleEliminationStageFinalizedService {

  handle(tourney: Tourney, finalizedStageType: TourneyDoubleEliminationStageType): void {
    const stage = this.getStage(tourney, finalizedStageType);
    const stageKind = TourneyDoubleEliminationStageType.toStageKind(finalizedStageType);

    let winners = stage.matches.map(match => MatchPlayer.From(Match.winner(match).name));
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
        case TourneyDoubleEliminationStageKind.Looser:
          nextStageForWinners.matches.forEach((match, index) => {
            match.playerTwo = winners[index]
          });
          break;
        case TourneyDoubleEliminationStageKind.LooserWithInjection:
          nextStageForWinners.matches.forEach((match, index) => {
            match.playerOne = winners[2 * index]
            match.playerTwo = winners[2 * index + 1]
          });
          break;
      }
    }

    const nextStageForLoosers = this.tryGetStage(tourney, TourneyDoubleEliminationStageType.looserAdvancesTo(finalizedStageType));
    if (nextStageForLoosers) {
      let loosers = stage.matches.map(match => MatchPlayer.From(Match.looser(match).name));
      switch (stageKind) {
        case TourneyDoubleEliminationStageKind.Entry:
          nextStageForLoosers.matches.forEach((match, index) => {
            match.playerOne = loosers[2 * index]
            match.playerTwo = loosers[2 * index + 1]
          });
          break;
        case TourneyDoubleEliminationStageKind.Winner:
          nextStageForLoosers.matches.forEach((match, index) => {
            match.playerOne = loosers[index]
          });
          break;
        case TourneyDoubleEliminationStageKind.Looser:
          break;
      }
    }

    // If there is no next stages in the double elimination phase,
    // then the winners advance to the single elimination phase and the current phase is completed
    if (nextStageForWinners) {
      this.setStatus(nextStageForWinners);
    } else {
      const eliminationStage = tourney.eliminationStages[0];
      eliminationStage.matches
        .forEach((match, index) => stageKind === TourneyDoubleEliminationStageKind.Winner
          ? match.playerOne = winners[index]
          : match.playerTwo = winners[index]);

      if(this.stageFullySeeded(eliminationStage)) {
        eliminationStage.status = TourneyPhaseStatus.readyOrOngoing;
      }

      stage.status = TourneyPhaseStatus.finalized;
    }

    if (nextStageForLoosers) {
      this.setStatus(nextStageForLoosers);
    }
  }

  private stageFullySeeded(stage: TourneyEliminationStage): Boolean {
    return !stage.matches
      .flatMap(match => [match.playerOne, match.playerTwo])
      .map(player => !MatchPlayer.isDetermined(player))
      .some(value => value);
  }

  private setStatus(nextStage: DoubleEliminationEliminationStage) {
    if (this.stageFullySeeded(nextStage)) {
      nextStage.status = TourneyPhaseStatus.readyOrOngoing;
    }
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

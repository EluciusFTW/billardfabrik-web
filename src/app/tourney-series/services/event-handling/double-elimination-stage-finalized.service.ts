import { Injectable } from "@angular/core";
import { MatchPlayer } from "../../models/match-player";
import { Tourney } from "../../models/tourney";
import { TourneyDoubleEliminationStageKind, TourneyDoubleEliminationStageType } from "../../models/tourney-double-elimination-stage-type";
import { DoubleEliminationEliminationStage } from "../../models/tourney-elimination-stage";
import { TourneyPhaseStatus } from "../../models/tourney-phase-status";

@Injectable()
export class DoubleEliminationStageFinalizedService {

  handle(tourney: Tourney, finalizedStageType: TourneyDoubleEliminationStageType): void {
    console.log('Hi: ', finalizedStageType);
    const stage = this.getStage(tourney, finalizedStageType);
    const stageKind = TourneyDoubleEliminationStageType.toStageKind(finalizedStageType);

    const nextStageForWinners = this.tryGetStage(tourney, TourneyDoubleEliminationStageType.winnerAdvancesTo(finalizedStageType));
    const nextStageForLoosers = this.tryGetStage(tourney, TourneyDoubleEliminationStageType.looserAdvancesTo(finalizedStageType));

    if (nextStageForWinners && !nextStageForLoosers) {
      throw Error('Tourney has a next DE stage for winners, but not for loosers.');
    }

    let winners = stage.matches.map(match => MatchPlayer.From(match.winner().name));
    if (nextStageForWinners) {
      switch (stageKind) {
        case TourneyDoubleEliminationStageKind.Entry:
        case TourneyDoubleEliminationStageKind.Winner:
          nextStageForWinners.matches.forEach((match, index) => {
            match.playerOne = winners[2 * index]
            match.playerTwo = winners[2 * index + 1]
          });
          break;
        case TourneyDoubleEliminationStageKind.Looser: break;
      }
    }

    // If there is a next stage for winners, there should always be one for loosers, too.
    if (nextStageForLoosers) {
      let loosers = stage.matches.map(match => MatchPlayer.From(match.looser().name));
      switch (stageKind) {
        case TourneyDoubleEliminationStageKind.Entry:
          nextStageForLoosers.matches.forEach((match, index) => {
            match.playerOne = loosers[2 * index]
            match.playerTwo = loosers[2 * index + 1]
          });
          break;
        case TourneyDoubleEliminationStageKind.Winner:
          nextStageForWinners.matches.forEach((match, index) => {
            match.playerOne = loosers[index]
          });
          break;
        case TourneyDoubleEliminationStageKind.Looser:
          break;
      }
    }

    // If there is no next stages in the DE stage, then the winners advance to SE and the phase is completed
    if (!nextStageForLoosers && !nextStageForWinners) {
      tourney.eliminationStages[0].matches
        .forEach((match, index) => stageKind === TourneyDoubleEliminationStageKind.Winner
          ? match.playerOne = winners[index]
          : match.playerTwo = winners[index]);
      stage.status = TourneyPhaseStatus.finalized;
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

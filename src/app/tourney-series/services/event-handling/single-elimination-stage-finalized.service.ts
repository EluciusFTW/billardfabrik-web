import { Injectable } from '@angular/core';
import { Match } from '../../models/match';
import { Tourney } from '../../models/tourney';
import { SingleEliminationEliminationStage } from '../../models/tourney-elimination-stage';
import { TourneyPhaseStatus } from '../../models/tourney-phase-status';
import { TourneyEliminationStageType } from '../../models/tourney-single-elimination-stage-type';
import { TourneyStatus } from '../../models/tourney-status';

@Injectable()
export class SingleEliminationStageFinalizedService {

  handle(tourney: Tourney, finalizedStageType: TourneyEliminationStageType): void {
    let finalizedStage = this.getStage(tourney, finalizedStageType);
    if (finalizedStage.type > TourneyEliminationStageType.semiFinal) {
      this.populateNextStage(tourney, finalizedStage)
    } else if (finalizedStage.type === TourneyEliminationStageType.semiFinal) {
      this.populateFinals(tourney, finalizedStage);
    }

    this.completeTourneyIfAllStatesAreFinalized(tourney);
  }

  private populateNextStage(tourney: Tourney, finalizedStage: SingleEliminationEliminationStage): void {
    let pairs = this.getWinnersChunked(finalizedStage.matches);
    const next = TourneyEliminationStageType.after(finalizedStage.type);
    this.prepareStage(tourney, next, pairs);
  }

  private populateFinals(tourney: Tourney, finalizedStage: SingleEliminationEliminationStage): void {
    let winners = finalizedStage.matches.map(match => Match.winner(match).name);
    this.prepareStage(tourney, TourneyEliminationStageType.final, [winners]);

    let losers = finalizedStage.matches.map(match => Match.loser(match).name);
    this.prepareStage(tourney, TourneyEliminationStageType.thirdPlace, [losers]);
  }

  private completeTourneyIfAllStatesAreFinalized(tourney: Tourney): void {
    if (!tourney.eliminationStages.find(stage => stage.status !== TourneyPhaseStatus.finalized)) {
      tourney.meta.status = TourneyStatus.completed;
    }
  }

  private getStage(tourney: Tourney, stageType: TourneyEliminationStageType): SingleEliminationEliminationStage {
    const stage = tourney.eliminationStages.find(stage => stage.type === stageType);
    if (!stage) {
      throw Error(`Cannot finalize a stage of type ${stageType}, because the tourney has none.`);
    }
    if (stage.status !== TourneyPhaseStatus.finalized) {
      throw Error(`Cannot process finalization event because the stage ${stageType} is not finalized.`);
    }
    return stage;
  }

  private prepareStage(tourney: Tourney, stageType: TourneyEliminationStageType, playerPairs: string[][]) {
    let stage = tourney.eliminationStages.find(stage => stage.type === stageType);
    stage.matches.forEach(match => {
      let pair = playerPairs.pop();
      this.populatePlayers(match, pair);
    });
    stage.status = TourneyPhaseStatus.readyOrOngoing;
  }

  private getWinnersChunked(matches: Match[]): string[][] {
    let winners = matches.map(match => Match.winner(match).name);
    let pairs: string[][] = [];
    while (winners.length > 0) {
      pairs.push(winners.splice(0, 2));
    }
    return pairs;
  }

  private populatePlayers(match: Match, pairOfPlayers: string[]): void {
    match.playerOne.name = pairOfPlayers[0];
    match.playerTwo.name = pairOfPlayers[1];
  }
}

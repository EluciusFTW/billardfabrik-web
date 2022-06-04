import { Injectable } from '@angular/core';
import { Match } from '../models/match';
import { Tourney } from '../models/tourney';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';
import { TourneyStatus } from '../models/tourney-status';

@Injectable()
export class TourneyEliminationStageFinalizedService {

  handle(tourney: Tourney): void {
    let finalizedStageIndex = tourney.eliminationStages.findIndex(stage => stage.status !== TourneyPhaseStatus.finalized) - 1;
    if (finalizedStageIndex < 0) {
      tourney.meta.status = TourneyStatus.completed
      return;
    }

    let finalizedStage = tourney.eliminationStages[finalizedStageIndex];
    if (finalizedStage.type >= TourneyEliminationStageType.semiFinal) {
      let pairs = this.getWinnersChunked(finalizedStage.matches);
      const next = TourneyEliminationStageType.after(finalizedStage.type);
      this.prepareStage(tourney, next, pairs);

    } else if (finalizedStage.type === TourneyEliminationStageType.semiFinal) {
      let winners = finalizedStage.matches.map(match => match.winner().name);
      this.prepareStage(tourney, TourneyEliminationStageType.final, [winners]);

      let losers = finalizedStage.matches.map(match => match.looser().name);
      this.prepareStage(tourney, TourneyEliminationStageType.thirdPlace, [losers]);
    }
  }

  prepareStage(tourney: Tourney, stageType: TourneyEliminationStageType, playerPairs: string[][]) {
    let stage = tourney.eliminationStages.find(stage => stage.type === stageType);
    stage.matches.forEach(match => {
      let pair = playerPairs.pop();
      this.populatePlayers(match, pair);
    });
    stage.status = TourneyPhaseStatus.readyOrOngoing;
  }

  private getWinnersChunked(matches: Match[]): string[][] {
    let winners = matches.map(match => match.winner().name);
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

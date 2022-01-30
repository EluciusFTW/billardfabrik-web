import { Injectable } from '@angular/core';
import { Match } from '../models/match';
import { Tourney } from '../models/tourney';
import { TourneyEliminationStageType } from '../models/Tourney-elimination-stage';
import { TourneyPhaseEvent } from '../models/tourney-phase-event';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { TourneyStatus } from '../models/tourney-status';
import { TourneyStandingCalculationService } from './tourney-standing-calculation.service';

@Injectable({
  providedIn: 'root'
})
export class TourneyEventService {

  constructor(private standingsCalculator: TourneyStandingCalculationService) { }

  apply(tourney: Tourney, event: TourneyPhaseEvent): void {
    switch (event) {
      case TourneyPhaseEvent.started: {
        this.startTourney(tourney);
        return;
      }

      case TourneyPhaseEvent.groupStageFinalized: {
        this.handleGroupStageFinalized(tourney);
        return;
      }

      case TourneyPhaseEvent.eliminationStageFinalized: {
        this.handleEliminationStageFinalized(tourney);
        return;
      }

      case TourneyPhaseEvent.eliminationStageFinalized: {
        this.handleEliminationStageFinalized(tourney);
        return;
      }

      case TourneyPhaseEvent.resultsPostProcessed: {
        tourney.meta.status = TourneyStatus.postProcessed;
        return;
      }
    }
  }

  handleEliminationStageFinalized(tourney: Tourney) {
    let finalizedStageIndex = tourney.eliminationStages.findIndex(stage => stage.status !== TourneyPhaseStatus.finalized) - 1;
    if (finalizedStageIndex < 0) {
      tourney.meta.status = TourneyStatus.completed
      return;
    }

    let finalizedStage = tourney.eliminationStages[finalizedStageIndex];
    if (finalizedStage.type < TourneyEliminationStageType.semiFinal) {
      let pairs = this.getWinnersChunked(finalizedStage.matches);
      const next = TourneyEliminationStageType.after(finalizedStage.type);
      this.prepareStage(tourney, next, pairs);

    } else if (finalizedStage.type === TourneyEliminationStageType.semiFinal) {
      let winners = finalizedStage.matches.map(match => this.getMatchWinner(match));
      this.prepareStage(tourney, TourneyEliminationStageType.final, [winners]);

      let losers = finalizedStage.matches.map(match => this.getMatchLoser(match));
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
    let winners = matches.map(match => this.getMatchWinner(match));
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

  private getMatchWinner(match: Match): string {
    return match.playerOne.points === match.length
      ? match.playerOne.name
      : match.playerTwo.name;
  }

  private getMatchLoser(match: Match): string {
    return match.playerOne.points === match.length
      ? match.playerTwo.name
      : match.playerOne.name;
  }

  handleGroupStageFinalized(tourney: Tourney) {
    const ongoingGroups = tourney.groups.filter(group => group.status !== TourneyPhaseStatus.finalized);
    if (ongoingGroups.length === 0) {
      tourney.eliminationStages[0].status = TourneyPhaseStatus.readyOrOngoing;

      let randomizedChunks = this.extractWinnersToRandomChunks(tourney);
      tourney.eliminationStages[0].matches.forEach(match => {
        let pair = randomizedChunks.pop();
        this.populatePlayers(match, pair);
      });
    }
  }

  private extractWinnersToRandomChunks(tourney: Tourney) : string [][]{
    let reorderedChunked: string [][] = [];
    let winnersPerGroup = tourney.groups
        .map(group => this.standingsCalculator.calculcateStanding(group))
        .map(standings => standings.slice(0, 2))
        .map(standings => standings.map(s => s.name));
    do {
      reorderedChunked = this.chunk(this.reOrderRandomly(winnersPerGroup.reduce((a, b) => a.concat(b))), 2);
     } while(reorderedChunked.some(chunk => this.fromSameGroup(chunk, winnersPerGroup)))
    return reorderedChunked;
  }

  private fromSameGroup(chunk: string[], winnersPerGroup: string[][]): boolean {
    return winnersPerGroup.some(winnerChunk => chunk.includes(winnerChunk[0]) && chunk.includes(winnerChunk[1]));
  }

  private reOrderRandomly(players: string[]): string[] {
    let randomOrderedPlayers: string[] = [];
    while (players.length > 0) {
      let randomIndex = Math.floor(Math.random() * players.length);
      randomOrderedPlayers.push(players[randomIndex]);
      players.splice(randomIndex, 1);
    }
    return randomOrderedPlayers;
  }

  private chunk(array: any[], size: number): any[][] {
    let result: any[][] = [];
    while (array.length > 0) {
      result.push(array.splice(0, size));
    }
    return result;
  }

  startTourney(tourney: Tourney) {
    tourney.meta.status = TourneyStatus.ongoing;
    tourney.groups.forEach(group => group.status = TourneyPhaseStatus.readyOrOngoing);
  }
}

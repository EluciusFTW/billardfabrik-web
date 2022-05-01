import { Injectable } from '@angular/core';
import { Match } from '../models/match';
import { Tourney } from '../models/tourney';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { TourneyStandingCalculationService } from './tourney-standing-calculation.service';

@Injectable()
export class TourneyGroupStageFinalizedService {

  constructor(private standingsCalculator: TourneyStandingCalculationService) { }

  handle(tourney: Tourney): void {
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

  private extractWinnersToRandomChunks(tourney: Tourney): string[][] {
    let reorderedChunked: string[][] = [];
    let winnersPerGroup = tourney.groups
      .map(group => this.standingsCalculator.calculcateStanding(group))
      .map(standings => standings.slice(0, 2))
      .map(standings => standings.map(s => s.name));

    do {
      reorderedChunked = this.chunk(this.reOrderRandomly(winnersPerGroup.reduce((a, b) => a.concat(b))), 2);
    } while (reorderedChunked.some(chunk => this.fromSameGroup(chunk, winnersPerGroup)))

    return reorderedChunked;
  }

  private populatePlayers(match: Match, pairOfPlayers: string[]): void {
    match.playerOne.name = pairOfPlayers[0];
    match.playerTwo.name = pairOfPlayers[1];
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
}

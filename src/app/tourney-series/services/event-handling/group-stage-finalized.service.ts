import { Injectable } from '@angular/core';
import { Match } from '../../models/match';
import { Tourney } from '../../models/tourney';
import { TourneyPhaseStatus } from '../../models/tourney-phase-status';
import { GroupFunctions } from '../../tourney-group/group-functions';
import { CreationFunctions } from '../creation/creation.functions';

@Injectable()
export class GroupStageFinalizedService {

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
      .map(group => GroupFunctions.calculcateStanding(group))
      .map(standings => standings.slice(0, 2))
      .map(standings => standings.map(s => s.name));

    do {
      reorderedChunked = CreationFunctions.chunk(CreationFunctions.reOrderRandomly(winnersPerGroup.reduce((a, b) => a.concat(b))), 2);
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
}

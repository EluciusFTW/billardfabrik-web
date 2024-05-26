import { Match } from '../models/match';
import { Tourney } from '../models/tourney';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { GroupFunctions } from '../tourney-group/group-functions';
import { chunk, reOrderRandomly } from '../../shared/utility.functions';

export function handleGroupStageFinalized(tourney: Tourney): void {
  const ongoingGroups = tourney.groups.filter(group => group.status !== TourneyPhaseStatus.finalized);
  if (ongoingGroups.length === 0) {
    tourney.eliminationStages[0].status = TourneyPhaseStatus.readyOrOngoing;

    let randomizedChunks = extractWinnersToRandomChunks(tourney);
    tourney.eliminationStages[0].matches.forEach(match => {
      let pair = randomizedChunks.pop();
      populatePlayers(match, pair);
    });
  }
}

function extractWinnersToRandomChunks(tourney: Tourney): string[][] {
  let reorderedChunked: string[][] = [];
  const winnersPerGroup = tourney.groups
    .map(group => GroupFunctions.calculcateStanding(group))
    .map(standings => standings.slice(0, 2))
    .map(standings => standings.map(s => s.name));

  do {
    reorderedChunked = chunk(reOrderRandomly(winnersPerGroup.reduce((a, b) => a.concat(b))), 2);
  } while (reorderedChunked.some(chunk => fromSameGroup(chunk, winnersPerGroup)))

  return reorderedChunked;
}

function populatePlayers(match: Match, pairOfPlayers: string[]): void {
  match.playerOne.name = pairOfPlayers[0];
  match.playerTwo.name = pairOfPlayers[1];
}

function fromSameGroup(chunk: string[], winnersPerGroup: string[][]): boolean {
  return winnersPerGroup.some(winnerChunk => chunk.includes(winnerChunk[0]) && chunk.includes(winnerChunk[1]));
}

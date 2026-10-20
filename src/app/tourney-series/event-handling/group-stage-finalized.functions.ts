import { Match } from '../models/match';
import { Tourney } from '../models/tourney';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { GroupFunctions } from '../tourney-group/group-functions';
import { chunk, reOrderRandomly } from '../../shared/utility.functions';

export function handleGroupStageFinalized(tourney: Tourney): void {
  const ongoingGroups = tourney.groups.filter(group => group.status !== TourneyPhaseStatus.finalized);
  if (ongoingGroups.length === 0) {
    tourney.eliminationStages[0].status = TourneyPhaseStatus.readyOrOngoing;

    const qualifiedPerGroup = getQualifiedPerGroup(tourney);
    const pairs = tourney.meta.knockoutPairing === 'Crossover'
      ? pairCrossover(qualifiedPerGroup)
      : pairRandomly(qualifiedPerGroup);

    tourney.eliminationStages[0].matches.forEach((match, index) => populatePlayers(match, pairs[index]));
  }
}

// Winner and runner-up of each group, ordered by group number
function getQualifiedPerGroup(tourney: Tourney): string[][] {
  return [...tourney.groups]
    .sort((a, b) => a.number - b.number)
    .map(group => GroupFunctions.calculcateStanding(group))
    .map(standings => standings.slice(0, 2))
    .map(standings => standings.map(s => s.name));
}

// Groups are taken in pairs (1 & 2, 3 & 4, ...): the winner of one group plays the runner-up of the other,
// the X1–Y2 matches fill the top half of the bracket and the Y1–X2 matches the bottom half,
// so winner and runner-up of the same group can only meet in the final
function pairCrossover(qualifiedPerGroup: string[][]): string[][] {
  if (qualifiedPerGroup.length === 1) {
    return qualifiedPerGroup;
  }

  const groupPairs = chunk([...qualifiedPerGroup], 2);
  return [
    ...groupPairs.map(([x, y]) => [x[0], y[1]]),
    ...groupPairs.map(([x, y]) => [y[0], x[1]])
  ];
}

function pairRandomly(qualifiedPerGroup: string[][]): string[][] {
  let reorderedChunked: string[][] = [];

  do {
    reorderedChunked = chunk(reOrderRandomly(qualifiedPerGroup.flat()), 2);
  } while (reorderedChunked.some(chunk => fromSameGroup(chunk, qualifiedPerGroup)))

  return reorderedChunked;
}

function populatePlayers(match: Match, pairOfPlayers: string[]): void {
  match.playerOne.name = pairOfPlayers[0];
  match.playerTwo.name = pairOfPlayers[1];
}

function fromSameGroup(chunk: string[], qualifiedPerGroup: string[][]): boolean {
  return qualifiedPerGroup.some(qualified => chunk.includes(qualified[0]) && chunk.includes(qualified[1]));
}

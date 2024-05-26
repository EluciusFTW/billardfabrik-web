import { reOrderRandomly } from 'src/app/shared/utility.functions';
import { Match } from '../models/match';
import { MatchPlayer } from '../models/match-player';
import { TourneyGroup } from '../models/tourney-group';
import { GroupsThenSingleEliminationTourneyInfo } from '../models/tourney-info';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';

export function createGroups(info: GroupsThenSingleEliminationTourneyInfo): TourneyGroup[] {
  let randomOrderedPlayers = reOrderRandomly([...info.players]);
  return buildGroups(randomOrderedPlayers, info);
}

export function determineStartingStageAfterGroups(info: GroupsThenSingleEliminationTourneyInfo): TourneyEliminationStageType {
  return info.nrOfGroups === 8
    ? TourneyEliminationStageType.last32
    : info.nrOfGroups >= 4
      ? TourneyEliminationStageType.quarterFinal
      : info.nrOfGroups >= 2
        ? TourneyEliminationStageType.semiFinal
        : TourneyEliminationStageType.final;
}

function buildGroups(players: string[], info: GroupsThenSingleEliminationTourneyInfo): TourneyGroup[] {
  let groups: TourneyGroup[] = [];
  let groupSize = Math.ceil(players.length / info.nrOfGroups);
  let groupNumber = 1

  while (groupNumber <= info.nrOfGroups) {
    const chunk = players.splice(0, groupSize - 1);
    groups.push({
      number: groupNumber++,
      players: chunk,
      matches: [],
      status: TourneyPhaseStatus.waitingForApproval
    });
  }

  players.forEach((player, index) => groups[index].players.push(player));
  groups.forEach(group => group.matches = buildMatches(group.players, info))

  return groups;
}

function buildMatches(players: string[], info: GroupsThenSingleEliminationTourneyInfo): Match[] {
  return listings(players.length).map(listing => ToMatch(listing, players, info));
}

function listings(nrOfPlayers: number): number[][] {
  switch (nrOfPlayers) {
    case 2: return [
      [1, 2]
    ];
    case 3: return [
      [1, 2],
      [1, 3],
      [2, 3]
    ];
    case 4: return [
      [1, 2], [3, 4],
      [1, 3], [2, 4],
      [1, 4], [2, 3]
    ];
    case 5: return [
      [1, 2], [3, 4],
      [1, 3], [2, 5],
      [1, 4], [3, 5],
      [1, 5], [2, 4],
      [2, 3], [4, 5]
    ];
    case 6: return [
      [1, 2], [3, 4], [5, 6],
      [1, 3], [2, 5], [4, 6],
      [1, 4], [2, 6], [3, 5],
      [1, 5], [2, 4], [3, 6],
      [1, 6], [2, 3], [4, 5]
    ];
    default: throw new Error(nrOfPlayers + " is not a valid group size!");
  }
}

function ToMatch(listing: number[], players: string[], info: GroupsThenSingleEliminationTourneyInfo): Match {
  return Match.create(
    MatchPlayer.From(players[listing[0] - 1]),
    MatchPlayer.From(players[listing[1] - 1]),
    info.discipline,
    info.raceLength
  )
}

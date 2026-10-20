import { reOrderRandomly } from 'src/app/shared/utility.functions';
import { Match } from '../models/match';
import { MatchPlayer } from '../models/match-player';
import { TourneyGroup } from '../models/tourney-group';
import { GroupsThenSingleEliminationTourneyInfo } from '../models/tourney-info';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';

export function createGroups(info: GroupsThenSingleEliminationTourneyInfo): TourneyGroup[] {
  return buildGroups(drawPlayers(info), info);
}

export function determineStartingStageAfterGroups(info: GroupsThenSingleEliminationTourneyInfo): TourneyEliminationStageType {
  return info.nrOfGroups === 8
    ? TourneyEliminationStageType.last16
    : info.nrOfGroups >= 4
      ? TourneyEliminationStageType.quarterFinal
      : info.nrOfGroups >= 2
        ? TourneyEliminationStageType.semiFinal
        : TourneyEliminationStageType.final;
}

// When seeded, the top seeds (one per group) are drawn first, so each group gets exactly one of them
function drawPlayers(info: GroupsThenSingleEliminationTourneyInfo): string[] {
  return info.seeded
    ? [
      ...reOrderRandomly(info.players.slice(0, info.nrOfGroups)),
      ...reOrderRandomly(info.players.slice(info.nrOfGroups))
    ]
    : reOrderRandomly([...info.players]);
}

// Deals the players round-robin, so the first player of each group comes from the start of the list
// and group sizes differ by at most one (the first groups get the extra players)
function buildGroups(players: string[], info: GroupsThenSingleEliminationTourneyInfo): TourneyGroup[] {
  return Array.from({ length: info.nrOfGroups }, (_, index) => {
    const groupPlayers = players.filter((_, playerIndex) => playerIndex % info.nrOfGroups === index);
    return {
      number: index + 1,
      players: groupPlayers,
      matches: buildMatches(groupPlayers, info),
      status: TourneyPhaseStatus.waitingForApproval
    };
  });
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

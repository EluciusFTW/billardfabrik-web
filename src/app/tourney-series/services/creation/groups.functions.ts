import { Match } from '../../models/match';
import { MatchPlayer } from '../../models/match-player';
import { TourneyGroup } from '../../models/tourney-group';
import { GroupsThenSingleEliminationTourneyInfo } from '../../models/tourney-info';
import { TourneyPhaseStatus } from '../../models/tourney-phase-status';
import { CreationFunctions } from './creation.functions';

export class GroupsFunctions {

  static create(info: GroupsThenSingleEliminationTourneyInfo): TourneyGroup[] {
    let randomOrderedPlayers = CreationFunctions.reOrderRandomly([... info.players]);
    return this.buildGroups(randomOrderedPlayers, info);
  }

  private static buildGroups(players: string[], info: GroupsThenSingleEliminationTourneyInfo): TourneyGroup[] {
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
    groups.forEach(group => group.matches = this.buildMatches(group.players, info))

    return groups;
  }

  private static buildMatches(players: string[], info: GroupsThenSingleEliminationTourneyInfo): Match[] {
    return this
      .listings(players.length)
      .map(listing => this.ToMatch(listing, players, info));
  }

  private static listings(nrOfPlayers: number): number[][] {
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

  private static ToMatch(listing: number[], players: string[], info: GroupsThenSingleEliminationTourneyInfo): Match {
    return Match.create(
      MatchPlayer.From(players[listing[0] - 1]),
      MatchPlayer.From(players[listing[1] - 1]),
      info.discipline,
      info.raceLength
    )
  }
}

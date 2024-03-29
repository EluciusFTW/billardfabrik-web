import { GroupStanding } from "../models/group-standing";
import { Match } from "../models/match";
import { TourneyGroup } from "../models/tourney-group";

export class GroupFunctions {

  static calculcateStanding(group: TourneyGroup) : GroupStanding[]{
      let startedMatches = group.matches.filter(match => Match.hasStarted(match));
      return group.players
        .map(player => this.calculateForPlayer(player, startedMatches))
        .sort(this.compare);
    }

  private static calculateForPlayer(player: string, matches: Match[]): GroupStanding {
    let isFirst = matches.filter(match => match.playerOne.name === player);
    let isSecond = matches.filter(match => match.playerTwo.name === player);

    return {
      name: player,
      games: isFirst.length + isSecond.length,
      won: isFirst.filter(match => match.playerOne.points === match.length).length + isSecond.filter(match => match.playerTwo.points === match.length).length,
      scoredGoals: isFirst.map(match => match.playerOne.points).concat(isSecond.map(match => match.playerTwo.points)).reduce((a, b) => a + b, 0),
      receivedGoals: isFirst.map(match => match.playerTwo.points).concat(isSecond.map(match => match.playerOne.points)).reduce((a, b) => a + b, 0),
    }
  }

  private static compare(first: GroupStanding, second: GroupStanding): number {
    if (first.won > second.won) return -1;
    if (first.won < second.won) return 1;

    if (first.scoredGoals - first.receivedGoals > second.scoredGoals - second.receivedGoals) return -1;
    if (first.scoredGoals - first.receivedGoals < second.scoredGoals - second.receivedGoals) return 1;

    if (first.scoredGoals > second.scoredGoals) return -1;
    if (first.scoredGoals < second.scoredGoals) return 1;

    return 0;
  }
}

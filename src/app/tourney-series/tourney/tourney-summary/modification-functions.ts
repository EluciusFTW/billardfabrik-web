import { Match } from "../../models/match";
import { MatchStatus } from "../../models/match-status";
import { Tourney } from "../../models/tourney";
import { TourneyGroup } from "../../models/tourney-group";

export class ModificationFunctions {

  public static InjectPlayer(tourney: Tourney, name: string): void {
    let group = this.chooseRandomGroup(tourney)
    this.addMatches(name, group);
    group.players.push(name);
  }

  private static chooseRandomGroup(tourney: Tourney): TourneyGroup {
    const smallestGroupsize = tourney.groups
      .map(group => group.players.length)
      .sort()[0];
    const viableGroups = tourney.groups.filter(group => group.players.length === smallestGroupsize);
    return viableGroups[Math.floor(Math.random() * viableGroups.length)];
  }

  private static addMatches(newPlayerName: string, group: TourneyGroup): void {
    const referenceMatch = group.matches[0];
    const matches = group.players
      .map(player => <Match>
        {
          playerOne: { name: newPlayerName, points: 0 },
          playerTwo: { name: player, points: 0 },
          discipline: referenceMatch.discipline,
          length: referenceMatch.length,
          status: MatchStatus.notStarted
        });

    group.matches.push(...matches);
  }
}

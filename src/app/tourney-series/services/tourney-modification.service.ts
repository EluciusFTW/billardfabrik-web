import { Injectable } from "@angular/core";
import { Match } from "../models/match";
import { MatchStatus } from "../models/match-status";
import { Tourney } from "../models/tourney";
import { TourneyGroup } from "../models/tourney-group";

@Injectable()
export class TourneyModificationService {

    injectPlayer(tourney: Tourney, name: string): void {
        let group = this.chooseRandomGroup(tourney)
        this.addMatches(name, group);
        group.players.push(name);
    }

    private chooseRandomGroup(tourney: Tourney): TourneyGroup {
        var smallestGroupsize = tourney.groups
            .map(group => group.players.length)
            .sort()[0];
        const viableGroups = tourney.groups.filter(group => group.players.length === smallestGroupsize);
        return viableGroups[Math.floor(Math.random() * viableGroups.length)];
    }

    private addMatches(newPlayerName: string, group: TourneyGroup): void {
        var referenceMatch = group.matches[0];
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
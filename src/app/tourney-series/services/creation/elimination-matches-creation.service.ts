import { Injectable } from '@angular/core';
import { Match } from '../../models/match';
import { MatchPlayer } from '../../models/match-player';
import { MatchStatus } from '../../models/match-status';
import { PoolDiscipline } from '../../models/pool-discipline';

@Injectable()
export class EliminationMatchesCreationService {

  getMatches(players: string[], raceTo: number, discipline: PoolDiscipline): Match[] {
    const randomizedPlayers = this.reOrderRandomly(players);
    return this.getMatchesInternal(randomizedPlayers, raceTo, discipline);
  }

  getMatchesInternal(players: string[], raceTo: number, discipline: PoolDiscipline): Match[] {
    let numberOfMatches = this.getNumberOfMatches(players.length);

    let firstPlayers = players
      .slice(0, numberOfMatches)
      .map(player => MatchPlayer.From(player));

    let lastPlayers = players
      .slice(numberOfMatches)
      .map(player => MatchPlayer.From(player))
      .concat(this.getWalks(2 * numberOfMatches - players.length));

    return firstPlayers
      .map((player, index) => ({
        playerOne: player,
        playerTwo: index % 2 === 0
          ? lastPlayers[index]
          : lastPlayers[numberOfMatches - (index + 1) / 2],
        discipline: discipline,
        length: raceTo,
        status: MatchStatus.notStarted
      }));
  }

  getWalks(numberOfWalks: number): MatchPlayer[] {
    let walks = new Array(numberOfWalks);
    for (let i = 0; i < numberOfWalks; i++) {
      walks[i] = MatchPlayer.Walk();
    }
    return walks;
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

  private getNumberOfMatches(numberOfPlayers: number): number {
    let counter = 0;
    do {
      numberOfPlayers = numberOfPlayers / 2;
      counter++;
    } while (numberOfPlayers > 1)
    return Math.pow(2, counter - 1);
  }
}

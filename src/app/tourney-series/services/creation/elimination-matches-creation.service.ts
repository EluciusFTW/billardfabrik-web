import { Injectable } from '@angular/core';
import { Match } from '../../models/match';
import { MatchPlayer } from '../../models/match-player';
import { MatchStatus } from '../../models/match-status';
import { PoolDiscipline } from '../../models/pool-discipline';

@Injectable()
export class EliminationMatchesCreationService {

  getMatchesFilledUpWithWalks(players: string[], raceTo: number, discipline: PoolDiscipline): Match[] {
    const randomizedPlayers = [
      ... this
        .reOrderRandomly(players)
        .map(name => MatchPlayer.From(name)),
      ... this.getWalks(this.nextPowerOfTwo(players.length) - players.length)
    ];

    return this.getMatchesInternal(randomizedPlayers, raceTo, discipline);
  }

  getMatches(players: string[], raceTo: number, discipline: PoolDiscipline): Match[] {
    if (players.length % 2 === 1) throw new Error('Number of players has to be even');

    const randomizedPlayers = this
      .reOrderRandomly(players)
      .map(name => MatchPlayer.From(name));

    return this.getMatchesInternal(randomizedPlayers, raceTo, discipline);
  }

  private getMatchesInternal(players: MatchPlayer[], raceTo: number, discipline: PoolDiscipline): Match[] {
    const numberOfMatches = players.length / 2;
    let firstPlayers = players.slice(0, numberOfMatches)
    let lastPlayers = players.slice(numberOfMatches)

    return firstPlayers
      .map((player, index) =>
      [
        player,
        index % 2 === 0
          ? lastPlayers[index]
          : lastPlayers[numberOfMatches - index]
      ])
      .map(pair => new Match(pair[0], pair[1], discipline, raceTo));
  }

  private getWalks(numberOfWalks: number): MatchPlayer[] {
    return Array(numberOfWalks).fill(MatchPlayer.Walk());
  }

  private reOrderRandomly(players: string[]): string[] {
    let clonedPlayers = [... players];
    let randomOrderedPlayers: string[] = [];
    while (clonedPlayers.length > 0) {
      let randomIndex = Math.floor(Math.random() * clonedPlayers.length);
      randomOrderedPlayers.push(clonedPlayers[randomIndex]);
      clonedPlayers.splice(randomIndex, 1);
    }
    return randomOrderedPlayers;
  }

  private nextPowerOfTwo(number: number): number {
    if (number < 0) throw new Error('Parameter has to be positive.');
    if (number === 0) return 0;

    let counter = 0;
    do {
      number = number / 2;
      counter++;
    } while (number > 1)
    return Math.pow(2, counter);
  }
}

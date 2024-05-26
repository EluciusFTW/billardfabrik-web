import { Match } from '../models/match';
import { MatchPlayer } from '../models/match-player';
import { PoolDiscipline } from '../models/pool-discipline';

export function getMatchesFilledUpWithWalks(playerNames: string[], raceTo: number, discipline: PoolDiscipline): Match[] {
  const randomizedPlayers = [
    ...getRandomizedPlayers(playerNames),
    ...getWalks(nextPowerOfTwo(playerNames.length) - playerNames.length)
  ];

  return getMatchesInternal(randomizedPlayers, raceTo, discipline);
}

export function getMatches(playerNames: string[], raceTo: number, discipline: PoolDiscipline): Match[] {
  if (playerNames.length % 2 === 1) throw new Error('Number of players has to be even');
  return getMatchesInternal(getRandomizedPlayers(playerNames), raceTo, discipline);
}

function getRandomizedPlayers(playerNames: string[]): MatchPlayer[] {
  return reOrderRandomly(playerNames).map(name => MatchPlayer.From(name));
}

function getMatchesInternal(players: MatchPlayer[], raceTo: number, discipline: PoolDiscipline): Match[] {
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
    .map(pair => Match.create(pair[0], pair[1], discipline, raceTo));
}

function getWalks(numberOfWalks: number): MatchPlayer[] {
  return Array(numberOfWalks).fill(MatchPlayer.Walk());
}

function reOrderRandomly(players: string[]): string[] {
  let clonedPlayers = [...players];
  let randomOrderedPlayers: string[] = [];
  while (clonedPlayers.length > 0) {
    let randomIndex = Math.floor(Math.random() * clonedPlayers.length);
    randomOrderedPlayers.push(clonedPlayers[randomIndex]);
    clonedPlayers.splice(randomIndex, 1);
  }
  return randomOrderedPlayers;
}

function nextPowerOfTwo(number: number): number {
  if (number < 0) throw new Error('Parameter has to be positive.');
  if (number === 0) return 0;

  let counter = 0;
  do {
    number = number / 2;
    counter++;
  } while (number > 1)
  return Math.pow(2, counter);
}

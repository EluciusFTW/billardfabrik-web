import { reOrderRandomly } from 'src/app/shared/utility.functions';

// Arranges seeds (strongest first) in bracket order, such that adjacent pairs meet in the next round
// and the top seeds can only meet as late as possible, e.g. 8 seeds: 1, 8, 4, 5, 2, 7, 3, 6.
export function toBracketOrder<T>(seeds: T[]): T[] {
  return seedPositions(seeds.length).map(position => seeds[position]);
}

// Pairs the top half (in bracket order) with the bottom half (in random order); with seeded players,
// seeds never meet in the first round and walks (appended last) go to random seeds.
export function pairTopHalfWithRandomBottomHalf<T>(players: T[]): [T, T][] {
  const playerCopy = [...players];
  const seededPlayers = playerCopy.splice(0, playerCopy.length / 2);

  const seededReordered = toBracketOrder(seededPlayers);
  const remainingReordered = reOrderRandomly(playerCopy);

  return seededReordered.map((player, index) => [player, remainingReordered[index]]);
}

// The seeds are the top half of the bracket, which is filled up with walks to the next power of two
export function numberOfBracketSeeds(numberOfPlayers: number): number {
  return numberOfPlayers < 2
    ? 0
    : Math.pow(2, Math.ceil(Math.log2(numberOfPlayers))) / 2;
}

// Seeds of the same tier (1–2, 3–4, 5–8, 9–16, ...) can meet a higher seed in the same round at the earliest
export function seedTier(seed: number): number {
  return Math.max(0, Math.ceil(Math.log2(seed)) - 1);
}

function seedPositions(numberOfSeeds: number): number[] {
  if (numberOfSeeds < 1 || !Number.isInteger(Math.log2(numberOfSeeds))) {
    throw new Error(`${numberOfSeeds} seeds cannot be arranged in a bracket, it has to be a power of two.`);
  }

  return numberOfSeeds === 1
    ? [0]
    : seedPositions(numberOfSeeds / 2).flatMap(position => [position, numberOfSeeds - 1 - position]);
}

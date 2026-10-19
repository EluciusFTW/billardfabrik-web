// Arranges seeds (strongest first) in bracket order, such that adjacent pairs meet in the next round
// and the top seeds can only meet as late as possible, e.g. 8 seeds: 1, 8, 4, 5, 2, 7, 3, 6.
export function toBracketOrder<T>(seeds: T[]): T[] {
  return seedPositions(seeds.length).map(position => seeds[position]);
}

function seedPositions(numberOfSeeds: number): number[] {
  if (numberOfSeeds < 1 || !Number.isInteger(Math.log2(numberOfSeeds))) {
    throw new Error(`${numberOfSeeds} seeds cannot be arranged in a bracket, it has to be a power of two.`);
  }

  return numberOfSeeds === 1
    ? [0]
    : seedPositions(numberOfSeeds / 2).flatMap(position => [position, numberOfSeeds - 1 - position]);
}

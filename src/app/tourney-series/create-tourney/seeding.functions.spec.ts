import { pairTopHalfWithRandomBottomHalf, toBracketOrder } from './seeding.functions';

describe('toBracketOrder', () => {
  const seeds = (count: number) => Array.from({ length: count }, (_, index) => index + 1);

  it.each([
    [1, [1]],
    [2, [1, 2]],
    [4, [1, 4, 2, 3]],
    [8, [1, 8, 4, 5, 2, 7, 3, 6]],
    [16, [1, 16, 8, 9, 4, 13, 5, 12, 2, 15, 7, 10, 3, 14, 6, 11]],
  ])('arranges %i seeds in bracket order', (count, expected) => {
    expect(toBracketOrder(seeds(count))).toEqual(expected);
  });

  it.each([2, 4, 8, 16, 32, 64])('keeps the sum of seeds meeting in each round constant for %i seeds', count => {
    let round = toBracketOrder(seeds(count));
    while (round.length > 1) {
      const pairs = Array.from({ length: round.length / 2 }, (_, index) => [round[2 * index], round[2 * index + 1]]);
      expect(new Set(pairs.map(([a, b]) => a + b)).size).toBe(1);
      round = pairs.map(([a, b]) => Math.min(a, b));
    }
  });

  it.each([0, 3, 6, 12])('rejects %i seeds', count => {
    expect(() => toBracketOrder(seeds(count))).toThrow();
  });
});

describe('pairTopHalfWithRandomBottomHalf', () => {
  const players = (count: number) => Array.from({ length: count }, (_, index) => index + 1);

  it.each([2, 4, 8, 16, 32])('pairs the top half in bracket order with the bottom half for %i players', count => {
    const pairs = pairTopHalfWithRandomBottomHalf(players(count));

    expect(pairs.map(([seed]) => seed)).toEqual(toBracketOrder(players(count / 2)));
    expect(pairs.map(([, unseeded]) => unseeded).sort((a, b) => a - b)).toEqual(players(count).slice(count / 2));
  });

  it('does not modify the given players', () => {
    const given = players(8);
    pairTopHalfWithRandomBottomHalf(given);
    expect(given).toEqual(players(8));
  });
});

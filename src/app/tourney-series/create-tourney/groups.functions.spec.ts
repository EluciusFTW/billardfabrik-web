import { GroupsThenSingleEliminationTourneyInfo } from '../models/tourney-info';
import { createGroups } from './groups.functions';

describe('createGroups', () => {
  const players = (count: number) => Array.from({ length: count }, (_, index) => `P${index + 1}`);
  const info = (count: number, nrOfGroups: number, seeded: boolean): GroupsThenSingleEliminationTourneyInfo => ({
    players: players(count),
    raceLength: 4,
    discipline: '9-Ball',
    mode: 'Gruppe + Einfach-K.O.',
    name: 'Test',
    seeded,
    nrOfGroups,
    knockoutPairing: 'Random',
  });

  const cases = [
    [5, 1],
    [8, 2],
    [10, 2],
    [13, 4],
    [16, 4],
    [24, 8],
  ];

  describe.each([true, false])('seeded: %s', seeded => {
    it.each(cases)('puts each of %i players into exactly one of %i groups of balanced size', (count, nrOfGroups) => {
      const groups = createGroups(info(count, nrOfGroups, seeded));

      expect(groups.map(group => group.number)).toEqual(Array.from({ length: nrOfGroups }, (_, index) => index + 1));
      expect(groups.flatMap(group => group.players).sort()).toEqual(players(count).sort());

      const sizes = groups.map(group => group.players.length);
      expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1);
      expect(sizes).toEqual([...sizes].sort((a, b) => b - a));
    });
  });

  it.each(cases)('places one top seed in each group when seeding %i players into %i groups', (count, nrOfGroups) => {
    const topSeeds = players(nrOfGroups);
    const groups = createGroups(info(count, nrOfGroups, true));

    groups.forEach(group => expect(group.players.filter(player => topSeeds.includes(player))).toHaveLength(1));
  });

  it('does not modify the given players', () => {
    const given = info(13, 4, true);
    createGroups(given);
    expect(given.players).toEqual(players(13));
  });
});

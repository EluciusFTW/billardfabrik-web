import { MatchPlayer } from '../models/match-player';
import { DoubleEliminationTourneyInfo } from '../models/tourney-info';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';
import { createDoubleEliminationStages } from './double-elimination-stage.functions';

describe('createDoubleEliminationStages', () => {
  const players = (count: number) => Array.from({ length: count }, (_, index) => `P${index + 1}`);
  const info = (count: number, seeded: boolean): DoubleEliminationTourneyInfo => ({
    players: players(count),
    raceLength: 4,
    discipline: '9-Ball',
    mode: 'Doppel-K.O.',
    name: 'Test',
    seeded,
    firstEliminationStage: TourneyEliminationStageType.semiFinal,
  });
  const entryMatches = (count: number, seeded: boolean) =>
    createDoubleEliminationStages(info(count, seeded), 4)[0].matches;

  it('places the seeds of a full bracket in bracket order', () => {
    const matches = entryMatches(16, true);

    expect(matches.map(match => match.playerOne.name)).toEqual(['P1', 'P8', 'P4', 'P5', 'P2', 'P7', 'P3', 'P6']);
    expect(matches.map(match => match.playerTwo.name).sort()).toEqual(players(16).slice(8).sort());
  });

  it('gives walks only to seeds when the bracket is not full', () => {
    const matches = entryMatches(12, true);

    expect(matches.map(match => match.playerOne.name)).toEqual(['P1', 'P8', 'P4', 'P5', 'P2', 'P7', 'P3', 'P6']);
    expect(matches.filter(match => MatchPlayer.isWalk(match.playerTwo))).toHaveLength(4);
    expect(matches.map(match => match.playerTwo.name).filter(name => name !== MatchPlayer.Walk().name).sort())
      .toEqual(['P10', 'P11', 'P12', 'P9']);
  });

  it.each([5, 8, 12, 16])('puts each of %i unseeded players exactly once into the entry stage, never two walks together', count => {
    const matches = entryMatches(count, false);
    const names = matches.flatMap(match => [match.playerOne.name, match.playerTwo.name]);

    expect(names.filter(name => name !== MatchPlayer.Walk().name).sort()).toEqual(players(count).sort());
    expect(matches.some(match => MatchPlayer.isWalk(match.playerOne) && MatchPlayer.isWalk(match.playerTwo))).toBe(false);
  });
});

import { Match } from '../models/match';
import { KnockoutPairing } from '../models/knockout-pairing';
import { Tourney } from '../models/tourney';
import { TourneyGroup } from '../models/tourney-group';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { TourneyStatus } from '../models/tourney-status';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';
import { GroupFunctions } from '../tourney-group/group-functions';
import { handleGroupStageFinalized } from './group-stage-finalized.functions';

describe('handleGroupStageFinalized', () => {
  const groupLetters = 'ABCDEFGH';

  // Players are named by group and final rank, e.g. B2 is the runner-up of group 2
  const group = (index: number): TourneyGroup => ({
    number: index + 1,
    players: [1, 2, 3].map(rank => `${groupLetters[index]}${rank}`),
    matches: [],
    status: TourneyPhaseStatus.finalized,
  });

  const tourney = (nrOfGroups: number, pairing: { knockoutPairing: KnockoutPairing } | {}): Tourney => ({
    groups: Array.from({ length: nrOfGroups }, (_, index) => group(index)).reverse(),
    eliminationStages: [{
      eliminationType: 'Single',
      type: TourneyEliminationStageType.startingStage(2 * nrOfGroups),
      title: '',
      matches: Array.from({ length: nrOfGroups }, () => Match.placeHolder('9-Ball', 4)),
      status: TourneyPhaseStatus.waitingForApproval,
    }],
    meta: {
      name: 'Test',
      numberOfPlayers: 3 * nrOfGroups,
      date: '20261020',
      status: TourneyStatus.ongoing,
      discipline: '9-Ball',
      modus: 'Gruppe + Einfach-K.O.',
      ...pairing,
    },
  });

  const pairs = (finalized: Tourney) =>
    finalized.eliminationStages[0].matches.map(match => [match.playerOne.name, match.playerTwo.name]);

  const finalize = (finalized: Tourney) => {
    handleGroupStageFinalized(finalized);
    return finalized;
  };

  beforeEach(() => {
    jest.spyOn(GroupFunctions, 'calculcateStanding').mockImplementation(group =>
      group.players.map(name => ({ name, games: 0, won: 0, scoredGoals: 0, receivedGoals: 0 })));
  });

  afterEach(() => jest.restoreAllMocks());

  it.each([
    [2, [['A1', 'B2'], ['B1', 'A2']]],
    [4, [['A1', 'B2'], ['C1', 'D2'], ['B1', 'A2'], ['D1', 'C2']]],
    [8, [
      ['A1', 'B2'], ['C1', 'D2'], ['E1', 'F2'], ['G1', 'H2'],
      ['B1', 'A2'], ['D1', 'C2'], ['F1', 'E2'], ['H1', 'G2'],
    ]],
  ])('pairs %i groups crosswise, with winner and runner-up of a group in different halves', (nrOfGroups, expected) => {
    const finalized = finalize(tourney(nrOfGroups, { knockoutPairing: 'Crossover' }));

    expect(pairs(finalized)).toEqual(expected);
    expect(finalized.eliminationStages[0].status).toBe(TourneyPhaseStatus.readyOrOngoing);
  });

  it.each([
    ['random pairing', { knockoutPairing: 'Random' as const }],
    ['no pairing stored (older tourneys)', {}],
  ])('pairs the qualified players of 4 groups randomly for %s, never two of the same group', (_, pairing) => {
    const finalized = finalize(tourney(4, pairing));
    const drawn = pairs(finalized);

    expect(drawn.flat().sort()).toEqual(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']);
    expect(drawn.some(([one, two]) => one[0] === two[0])).toBe(false);
  });

  it('waits until all groups are finalized', () => {
    const ongoing = tourney(2, { knockoutPairing: 'Crossover' });
    ongoing.groups[0].status = TourneyPhaseStatus.readyOrOngoing;

    finalize(ongoing);

    expect(ongoing.eliminationStages[0].status).toBe(TourneyPhaseStatus.waitingForApproval);
    expect(GroupFunctions.calculcateStanding).not.toHaveBeenCalled();
  });
});

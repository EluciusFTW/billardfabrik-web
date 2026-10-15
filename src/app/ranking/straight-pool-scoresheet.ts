// Scoresheet evaluation for 14/1 (straight pool) matches that are scored inning by inning.
// Like on a paper scoresheet, an inning records the balls left on the table and how often the
// rack was finished during it (each re-rack adds 14 virtual balls); the points follow from that.
// Rules (WPA):
//  - every legally pocketed ball is one point, also those pocketed in an inning that ends with a foul
//  - a foul costs one point, a breaking violation two points
//  - a third foul in three successive innings without a pocketed ball in between costs an extra
//    15 points; the balls are re-racked and the same player has to break again
//  - breaking violations do not count towards the successive fouls
//  - when one object ball is left, the other 14 are re-racked (marked on the inning)
// With an inning limit, the match ends once both players have played that many innings. If the
// score is tied then, both get 5 more innings, as often as needed.

export type PlayerSide = 'one' | 'two';
export type StraightPoolFoul = 'none' | 'foul' | 'breakFoul';

export type StraightPoolInning = {
  player: PlayerSide;
  ballsLeft: number;
  reracks: number;
  foul: StraightPoolFoul;
};

export type ScoredInning = StraightPoolInning & {
  points: number;
  // balls pocketed per rack, e.g. [4, 3]: 4 balls until the re-rack, then 3 more
  rackRuns: number[];
  // scoresheet notation of the rack runs, full racks in between are bullets: "4/3", "1/●/10", "6/(4●)/8"
  notation: string;
  // includes the 15 points for three successive fouls
  penalty: number;
  threeFouls: boolean;
  total: number;
};

export type PlayerSheet = {
  innings: ScoredInning[];
  total: number;
  highRun: number;
  average: number;
  successiveFouls: number;
};

export type Scoresheet = {
  one: PlayerSheet;
  two: PlayerSheet;
  ballsOnTable: number;
  nextPlayer: PlayerSide;
  // the inning limit including extensions after a tie, if the match has one
  inningLimit?: number;
  limitReached: boolean;
};

const FOUL_PENALTY = 1;
const BREAK_FOUL_PENALTY = 2;
const THREE_FOULS_PENALTY = 15;
export const BALLS_IN_RACK = 15;
export const BALLS_PER_RERACK = 14;
export const TIE_EXTENSION_INNINGS = 5;

export function opponent(player: PlayerSide): PlayerSide {
  return player === 'one' ? 'two' : 'one';
}

export function evaluateScoresheet(innings: StraightPoolInning[], inningLimit?: number): Scoresheet {
  const totals = { one: 0, two: 0 };
  const successiveFouls = { one: 0, two: 0 };
  const scored = { one: [] as ScoredInning[], two: [] as ScoredInning[] };
  let ballsOnTable = BALLS_IN_RACK;
  let nextPlayer: PlayerSide = 'one';
  let limit = inningLimit;
  let limitReached = false;

  for (const inning of innings) {
    const player = inning.player;
    const points = pointsOf(inning, ballsOnTable);
    let penalty = 0;
    let threeFouls = false;

    if (inning.foul === 'breakFoul') {
      penalty = BREAK_FOUL_PENALTY;
    } else if (inning.foul === 'foul') {
      penalty = FOUL_PENALTY;
      successiveFouls[player] = points > 0 ? 1 : successiveFouls[player] + 1;
      if (successiveFouls[player] === 3) {
        penalty += THREE_FOULS_PENALTY;
        threeFouls = true;
        successiveFouls[player] = 0;
      }
    } else {
      successiveFouls[player] = 0;
    }

    totals[player] += points - penalty;
    const rackRuns = rackRunsOf(inning, ballsOnTable);
    scored[player].push({ ...inning, points, rackRuns, notation: notationOf(rackRuns), penalty, threeFouls, total: totals[player] });
    ballsOnTable = threeFouls ? BALLS_IN_RACK : inning.ballsLeft;
    nextPlayer = threeFouls ? player : opponent(player);

    if (limit !== undefined) {
      if (scored.one.length >= limit && scored.two.length >= limit) {
        if (totals.one === totals.two) {
          limit += TIE_EXTENSION_INNINGS;
        } else {
          limitReached = true;
        }
      }

      // a player who has used up the innings cannot come to the table again, not even after three fouls
      if (scored[nextPlayer].length >= limit) {
        nextPlayer = opponent(nextPlayer);
      }
    }
  }

  return {
    one: playerSheet(scored.one, totals.one, successiveFouls.one),
    two: playerSheet(scored.two, totals.two, successiveFouls.two),
    ballsOnTable,
    nextPlayer,
    inningLimit: limit,
    limitReached
  };
}

export function pointsOf(inning: Pick<StraightPoolInning, 'ballsLeft' | 'reracks'>, ballsOnTable: number): number {
  return ballsOnTable + inning.reracks * BALLS_PER_RERACK - inning.ballsLeft;
}

// Down to the last ball in the first rack, 14 in every further full rack, and 15 minus the balls
// left in the last one (the remaining ball of the previous rack is part of it).
function rackRunsOf(inning: Pick<StraightPoolInning, 'ballsLeft' | 'reracks'>, ballsOnTable: number): number[] {
  if (inning.reracks === 0) {
    return [ballsOnTable - inning.ballsLeft];
  }

  return [
    ballsOnTable - 1,
    ...Array<number>(inning.reracks - 1).fill(BALLS_PER_RERACK),
    BALLS_IN_RACK - inning.ballsLeft
  ];
}

const FULL_RACK = '●';
const MAX_WRITTEN_OUT_FULL_RACKS = 3;

// Full racks in between are bullets, from four on they are counted: "1/●/●/10", "6/(4●)/8".
function notationOf(rackRuns: number[]): string {
  if (rackRuns.length === 1) {
    return `${rackRuns[0]}`;
  }

  const fullRacks = rackRuns.length - 2;
  const between = fullRacks > MAX_WRITTEN_OUT_FULL_RACKS
    ? [`(${fullRacks}${FULL_RACK})`]
    : Array<string>(fullRacks).fill(FULL_RACK);
  return [rackRuns[0], ...between, rackRuns.at(-1)].join('/');
}

function playerSheet(innings: ScoredInning[], total: number, successiveFouls: number): PlayerSheet {
  return {
    innings,
    total,
    highRun: Math.max(0, ...innings.map(inning => inning.points)),
    average: innings.length ? total / innings.length : 0,
    successiveFouls
  };
}

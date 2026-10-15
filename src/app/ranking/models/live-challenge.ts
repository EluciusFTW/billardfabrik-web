import { Match } from '../../tourney-series/models/match';
import { MatchPlayer } from '../../tourney-series/models/match-player';
import { MatchStatus } from '../../tourney-series/models/match-status';
import { PoolDiscipline } from '../../tourney-series/models/pool-discipline';
import { StraightPool } from '../../tourney-series/models/straight-pool';
import {
  InningLimit,
  Scoresheet,
  StraightPoolInning,
  evaluateScoresheet,
} from '../straight-pool-scoresheet';

export type LiveChallenge = RackChallenge | StraightPoolChallenge;
type Started = { startedAt: string };

export type RackChallenge = Match &
  Started & {
    discipline: Exclude<PoolDiscipline, typeof StraightPool.discipline>;
  };

export type StraightPoolChallenge = Match &
  Started & {
    discipline: typeof StraightPool.discipline;
    innings: StraightPoolInning[];
    inningLimit: InningLimit;
  };

export namespace LiveChallenge {
  export function start(match: Match, inningLimit: InningLimit): LiveChallenge {
    const { discipline } = match;
    const started = {
      ...match,
      status: MatchStatus.inProgress,
      startedAt: new Date().toISOString(),
    };
    // the narrowed discipline has to be set explicitly, the one spread from the match is any PoolDiscipline
    return discipline === StraightPool.discipline
      ? { ...started, discipline, innings: [], inningLimit }
      : { ...started, discipline };
  }

  export function isStraightPool(
    challenge: LiveChallenge,
  ): challenge is StraightPoolChallenge {
    return challenge.discipline === StraightPool.discipline;
  }

  export function scoresheet(challenge: StraightPoolChallenge): Scoresheet {
    return evaluateScoresheet(challenge.innings, challenge.inningLimit);
  }

  // Over when the race length is reached, or for 14/1 when the inning limit is used up without a tie.
  export function isOver(challenge: LiveChallenge): boolean {
    if (Match.isOver(challenge)) {
      return true;
    }

    if (!isStraightPool(challenge)) {
      return false;
    }

    const limit = scoresheet(challenge).inningLimit;
    return limit.kind === 'limited' && limit.reached;
  }

  export function winner(challenge: LiveChallenge): MatchPlayer | null {
    if (Match.isOver(challenge)) {
      return Match.winner(challenge);
    }

    if (!isOver(challenge)) {
      return null;
    }

    return challenge.playerOne.points > challenge.playerTwo.points
      ? challenge.playerOne
      : challenge.playerTwo;
  }
}

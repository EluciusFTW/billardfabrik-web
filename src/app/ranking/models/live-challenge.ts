import { Match } from '../../tourney-series/models/match';
import { MatchPlayer } from '../../tourney-series/models/match-player';
import { Scoresheet, StraightPoolInning, evaluateScoresheet } from '../straight-pool-scoresheet';

// A challenge match that is being played right now and scored live in the app.
// Once it is over it is moved to the incoming challenge matches for the elo ranking.
// 14/1 challenges are scored inning by inning; their points are derived from the innings.
export type LiveChallenge = Match & {
  startedAt: string;
  innings?: StraightPoolInning[];
  // 14/1 only: the match ends after this many innings per player
  inningLimit?: number;
};

export namespace LiveChallenge {

  export function scoresheet(challenge: LiveChallenge): Scoresheet {
    return evaluateScoresheet(challenge.innings ?? [], challenge.inningLimit);
  }

  // Over when the race length is reached, or when the inning limit is used up without a tie.
  export function isOver(challenge: LiveChallenge): boolean {
    return Match.isOver(challenge)
      || (challenge.inningLimit !== undefined && scoresheet(challenge).limitReached);
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

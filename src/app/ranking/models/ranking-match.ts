import { Match } from '../../tourney-series/models/match';
import { EloScores } from './elo-models';

type DatedMatch = Omit<Match & { date: string }, 'status'>

export type IncomingTourneyMatch = DatedMatch & { source: 'Tourney' }
export type IncomingChallengeMatch = DatedMatch & { source: 'Challenge' }
export type IncomingMatch = IncomingChallengeMatch | IncomingTourneyMatch;

export type ScoredMatch = IncomingMatch & {
  scores: EloScores;
};

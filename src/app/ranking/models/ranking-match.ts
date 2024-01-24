import { Match } from '../../tourney-series/models/match';
import { EloScores } from './elo-models';

export type MatchSource = 'Tourney' | 'Challenge';

export type IncomingMatch = Match & {
    date: string;
    source: MatchSource
};

export type ScoredMatch = IncomingMatch & {
  scores: EloScores;
};

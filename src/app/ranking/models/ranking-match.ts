import { Match } from '../../tourney-series/models/match';

export type MatchSource = 'Tourney' | 'Challenge';

export type IncomingMatch = Match & {
    date: string;
    source: MatchSource
};

export type RankingMatch = IncomingMatch & {
  diff: number;
};

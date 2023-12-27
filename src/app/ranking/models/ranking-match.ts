import { Match } from '../../tourney-series/models/match';

export type MatchSource = 'Tourney' | 'Challenge';
export type RankingMatch = Match & { 
    diff?: number; 
    date: string;
    source: MatchSource
};

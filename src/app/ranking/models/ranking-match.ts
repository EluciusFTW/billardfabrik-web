import { Match } from '../../tourney-series/models/match';

export type RankingMatch = Match & { 
    diff?: number; 
    date: string; 
};

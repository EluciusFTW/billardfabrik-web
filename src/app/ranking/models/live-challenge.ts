import { Match } from '../../tourney-series/models/match';

// A challenge match that is being played right now and scored live in the app.
// Once it is over it is moved to the incoming challenge matches for the elo ranking.
export type LiveChallenge = Match & { startedAt: string };

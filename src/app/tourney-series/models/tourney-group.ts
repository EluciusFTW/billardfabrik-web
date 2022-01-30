import { Match } from './match';
import { TourneyPhaseStatus } from './tourney-phase-status';

export interface TourneyGroup {
  number: number;
  players: string[];
  matches: Match[];
  status: TourneyPhaseStatus;
  qualified?: string[];
}

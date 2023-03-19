import { TourneyMode } from '../tourney-mode';
import { TourneyPlayerEvaluation } from './tourney-player-evaluation';

export interface TourneyEvaluation {
  players: TourneyPlayerEvaluation[];
  mode: TourneyMode;
}

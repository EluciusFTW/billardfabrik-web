import { PlacementRecord } from './placement-record';
import { PlayerMatchRecord } from './player-match-record';

export interface TourneyPlayerEvaluation {
  name: string;
  matches: PlayerMatchRecord[];
  placement: PlacementRecord;
}

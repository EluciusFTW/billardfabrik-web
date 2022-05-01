import { PlacementRecord } from './evaluation/placement-record';
import { PlayerMatchRecord } from './evaluation/player-match-record';

export interface TourneyPlayer {
  firstName: string;
  lastName: string;
  clubPlayer: boolean;
  club?: string;
  enteredInSystem: number;
  placements?: PlacementRecord[];
  matches?: PlayerMatchRecord[];
}

export interface PlayerResultsRecord {
  placements?: PlacementRecord[];
  matches?: PlayerMatchRecord[];
  achievements?: string[];
}

import { PlacementRecord } from './placement-record';
import { PlayerMatchRecord } from './player-match-record';

export interface TourneyPlayer {
  firstName: string;
  lastName: string;
  clubPlayer: boolean;
  enteredInSystem: number;
  placements?: PlacementRecord[];
  matches?: PlayerMatchRecord[];
}

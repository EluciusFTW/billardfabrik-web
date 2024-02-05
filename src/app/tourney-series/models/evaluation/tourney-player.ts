import { Player } from 'src/app/players/player';
import { PlacementRecord } from './placement-record';
import { PlayerMatchRecord } from './player-match-record';

export interface TourneyPlayer extends Player {
  placements?: PlacementRecord[];
  matches?: PlayerMatchRecord[];
}

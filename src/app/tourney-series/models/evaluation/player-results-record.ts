import { PlacementRecord } from "./placement-record";
import { PlayerMatchRecord } from "./player-match-record";

export interface PlayerResultsRecord {
  placements?: PlacementRecord[];
  matches?: PlayerMatchRecord[];
}

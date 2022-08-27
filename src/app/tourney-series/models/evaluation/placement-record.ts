import { BaseRecord } from './base-record';
import { TourneyPlacementType } from './tourney-placement-type';

export interface PlacementRecord extends BaseRecord {
  placement: TourneyPlacementType;
  points: number;
}

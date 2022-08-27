import { MatchType } from '../match-type';
import { BaseRecord } from './base-record';

export interface PlayerMatchRecord extends BaseRecord {
  opponent: string;
  myScore: number;
  oppScore: number;
  type: MatchType;
  when: number;
}

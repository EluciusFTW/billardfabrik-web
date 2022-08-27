import { PoolDiscipline } from '../pool-discipline';

export interface BaseRecord {
  discipline: PoolDiscipline;
  tourney?: string;
}

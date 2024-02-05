export const POOL_DISCIPLINES = [
  '8-Ball',
  '9-Ball',
  '10-Ball',
  '14/1',
  'One-Pocket',
  'Bank-Pool'
] as const;

export type PoolDiscipline = typeof POOL_DISCIPLINES[number];

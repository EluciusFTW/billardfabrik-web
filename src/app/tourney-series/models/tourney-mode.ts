export const TOURNEY_MODES = [
  'Gruppe + Einfach-K.O.',
  'Doppel-K.O.',
] as const;

export type TourneyMode = typeof TOURNEY_MODES[number];

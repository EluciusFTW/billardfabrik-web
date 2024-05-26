export const TOURNEY_MODES = [
  'Einfach-K.O.',
  'Gruppe + Einfach-K.O.',
  'Doppel-K.O.',
] as const;

export type TourneyMode = typeof TOURNEY_MODES[number];

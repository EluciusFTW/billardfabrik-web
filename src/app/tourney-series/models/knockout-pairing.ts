export const KNOCKOUT_PAIRINGS = [
  'Random',
  'Crossover',
] as const;

// How the qualified players of the groups are paired in the first knockout stage
export type KnockoutPairing = typeof KNOCKOUT_PAIRINGS[number];

export namespace KnockoutPairing {
  const _names: Record<KnockoutPairing, string> = {
    Random: 'Zufällig',
    Crossover: 'Über Kreuz',
  };

  export function map(pairing: KnockoutPairing): string {
    return _names[pairing];
  }
}

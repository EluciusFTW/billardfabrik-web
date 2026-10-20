// Which of the ordered players are seeded, depending on the tourney mode
export type SeedingScope =
  | { kind: 'Bracket'; numberOfSeeds: number }
  | { kind: 'Groups'; numberOfGroups: number };

export namespace SeedingScope {
  export function numberOfSeeds(scope: SeedingScope): number {
    switch (scope.kind) {
      case 'Bracket': return scope.numberOfSeeds;
      case 'Groups': return scope.numberOfGroups;
    }
  }
}

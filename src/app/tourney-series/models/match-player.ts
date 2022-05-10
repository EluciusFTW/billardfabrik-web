export interface MatchPlayer {
  name: string;
  points: number;
}

export namespace MatchPlayer {
  export function From(name: string): MatchPlayer{
    return {
      name: name,
      points: 0
    }
  }

  export function Unknown(): MatchPlayer{
    return {
      name: 't.b.d.',
      points: 0
    }
  }

  export function Walk(): MatchPlayer{
    return {
      name: 'Freilos',
      points: 0
    }
  }
}

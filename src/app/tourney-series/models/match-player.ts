export class MatchPlayer {
  name: string;
  points: number;

  constructor(name: string, points: number) {
    this.name = name;
    this.points = points;
  }

  static From(name: string) {
    // if(name === this._toBeDeterminedName) throw Error('"t.b.d." is a reserved name that cannot be used as a name for a player.');
    // if(name === this._walkName) throw Error('"Freilos" is a reserved name that cannot be used as a name for a player.')

    return new MatchPlayer(name, 0);
  }
}

export module MatchPlayer {

  const _toBeDeterminedName = 't.b.d.';
  const _walkName = 'Freilos';

  export function isReal(player: MatchPlayer): boolean {
    return !isWalk(player) && isDetermined(player);
  }

  export function isWalk(player: MatchPlayer): boolean {
    return player.name == _walkName;
  }

  export function isDetermined(player: MatchPlayer): boolean {
    return player.name !== _toBeDeterminedName;
  }

  export function Unknown(): MatchPlayer {
    return new MatchPlayer(_toBeDeterminedName, 0);
  }

  export function Walk(): MatchPlayer {
    return new MatchPlayer(_walkName, 0);
  }
}

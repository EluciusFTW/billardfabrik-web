export class MatchPlayer {
  name: string;
  points: number;

  static _toBeDeterminedName = 't.b.d.';
  static _walkName = 'Freilos';

  constructor(name: string, points: number) {
    this.name = name;
    this.points = points;
  }

  static From(name: string) {
    // if(name === this._toBeDeterminedName) throw Error('"t.b.d." is a reserved name that cannot be used as a name for a player.');
    // if(name === this._walkName) throw Error('"Freilos" is a reserved name that cannot be used as a name for a player.')

    return new MatchPlayer(name, 0);
  }

  isReal(): boolean {
    return this.name !== MatchPlayer._toBeDeterminedName && this.name !== MatchPlayer._walkName;
  }

  isDetermined(): boolean {
    return this.name !== MatchPlayer._toBeDeterminedName;
  }

  static Unknown() {
    return new MatchPlayer(this._toBeDeterminedName, 0);
  }

  static Walk() {
    return new MatchPlayer(this._walkName, 0);
  }
}

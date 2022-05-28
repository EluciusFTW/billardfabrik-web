export class MatchPlayer {
  name: string;
  points: number;

  constructor(name: string, points: number) {
    this.name = name;
    this.points = points;
  }

  static From(name: string) {
    return new MatchPlayer(name, 0);
  }

  static Unknown() {
    return new MatchPlayer('t.b.d.', 0);
  }

  static Walk() {
    return new MatchPlayer('Freilos', 0);
  }
}

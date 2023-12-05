export class EloFunctions {
  public static readonly InitialValue = 1500;
  private static readonly exponentDivisor = 400;
  private static readonly winBonus = 25;
  private static readonly K = 32;

  public static calculate(match: CompletedMatch, mode: EloMode = 'weightedWithBonus'): number {
    const q1 = this.Q(match.eloScoreOfOne);
    const q2 = this.Q(match.eloScoreOfTwo);

    const expected = this.E(q1,q2);
    const actual = mode !== 'classic'
      ? this.E(match.pointsScoredByOne, match.pointsScoredByTwo)
      : 1;

    const bonus = mode === 'weightedWithBonus'
      ? this.Bonus(match.pointsScoredByOne, match.pointsScoredByTwo)
      : 0;

    return Math.round(this.K * (actual + bonus - expected ));
  }

  private static Bonus(s1: number, s2:number): number {
    let m = Math.max(s1,s2);
    return m/(m + this.winBonus);
  }

  private static Q(elo: number): number {
    return Math.pow(10, elo / this.exponentDivisor);
  }

  private static E(q1: number, q2: number): number {
    return q1 / (q1+q2);
  }
}

export type EloMode = 'classic' | 'weighted' | 'weightedWithBonus';

export interface CompletedMatch {
  pointsScoredByOne: number;
  eloScoreOfOne: number;

  pointsScoredByTwo: number;
  eloScoreOfTwo: number;
}

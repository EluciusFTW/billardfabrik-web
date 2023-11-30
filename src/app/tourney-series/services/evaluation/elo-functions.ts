export class EloFunctions {
  private static readonly exponentDivisor = 400;
  private static readonly K = 32;

  public static calculate(match: CompletedMatch): number {
    const q1 = this.q(match.eloScoreOfOne);
    const q2 = this.q(match.eloScoreOfTwo);
    const e1 = this.e(q1,q2);
    const score = this.e(match.pointsScoredByOne, match.pointsScoredByTwo);

    return Math.round(EloFunctions.K * (score - e1));
  }

  private static q(eloScore: number): number {
    return Math.pow(10, eloScore / EloFunctions.exponentDivisor);
  }

  private static e(q1: number, q2: number): number {
    return q1 / (q1+q2);
  }
}

export interface CompletedMatch {
  pointsScoredByOne: number;
  eloScoreOfOne: number;

  pointsScoredByTwo: number;
  eloScoreOfTwo: number;
}

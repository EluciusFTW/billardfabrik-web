import { EloMatchInput, EloCalculationInput, EloMode, EloScores, EloStanding } from "./models/elo-models";

export class EloFunctions {

  public static readonly InitialValue = 1500;
  private static readonly exponentDivisor = 400;
  private static readonly winBonus = 40;
  private static readonly K = 32;

  public static Add(standing: EloStanding, scores: EloScores, forPlayer: 'P1' | 'P2'): EloStanding {
    return forPlayer === 'P1'
      ? {
        cla: standing.cla + scores.cla,
        wnb: standing.wnb + scores.wnb,
        wwb: standing.wwb + scores.wwb,
        bvf: standing.bvf + scores.bvf
      }
      : {
        cla: standing.cla - scores.cla,
        wnb: standing.wnb - scores.wnb,
        wwb: standing.wwb - scores.wwb,
        bvf: standing.bvf - scores.bvf
      }
  }

  public static calculateAll(match: EloMatchInput): EloScores {
    const ld1 = match.p1DataPoint;
    const ld2 = match.p2DataPoint;

    return {
      cla: this.calculate(
        { ...match, p1Elo: ld1.cla, p2Elo: ld2.cla },
        'classic'
      ),
      wnb: this.calculate(
        { ...match, p1Elo: ld1.wnb, p2Elo: ld2.wnb },
        'weighted'
      ),
      wwb: this.calculate(
        { ...match, p1Elo: ld1.wwb, p2Elo: ld2.wwb },
        'weightedWithBonus'
      ),
      bvf: this.calculateWithVaryingScale(
        { ...match, p1Elo: ld1.bvf, p2Elo: ld2.bvf },
      ),
    }
  }

  public static calculate(match: EloCalculationInput, mode: EloMode = 'weightedWithBonus'): number {
    return Math.round(this.K * this.calculateFactor(match, mode));
  }

  public static calculateWithVaryingScale(match: EloCalculationInput, mode: EloMode = 'weightedWithBonus'): number {
    return Math.round(this.getVaryingScaleFactor(match) * this.calculateFactor(match, mode));
  }

  private static getVaryingScaleFactor(match: EloCalculationInput) : number {
    const matchLength = Math.max(match.p1Points, match.p2Points);
    return matchLength < 5
      ? 16
      : matchLength < 7
        ? 32
        : 40;
  }

  private static calculateFactor(match: EloCalculationInput, mode: EloMode): number {
    const q1 = this.Q(match.p1Elo);
    const q2 = this.Q(match.p2Elo);

    const expected = this.E(q1,q2);
    const actual = mode !== 'classic'
      ? this.E(match.p1Points, match.p2Points)
      : match.p1Points > match.p2Points
        ? 1
        : 0;

    const bonus = mode === 'weightedWithBonus'
      ? this.Bonus(match.p1Points, match.p2Points)
      : 0;

    return actual + bonus - expected;
  }

  private static Bonus(s1: number, s2:number): number {
    const sign = Math.sign(s1 - s2);
    const m = Math.max(s1,s2);
    return sign * m/(m + this.winBonus);
  }

  private static Q(elo: number): number {
    return Math.pow(10, elo / this.exponentDivisor);
  }

  private static E(q1: number, q2: number): number {
    return q1 / (q1+q2);
  }
}

import { PoolDiscipline } from "../tourney-series/models/pool-discipline";
import { EloMatchInput, EloCalculationInput, EloMode, EloScores, EloStanding, NormalizedPoints } from "./models/elo-models";

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
    const normalizedPoints = this.getNormalizedPoints(match);
    const ld1 = match.p1DataPoint;
    const ld2 = match.p2DataPoint;

    return {
      cla: this.calculate(
        { ...normalizedPoints, p1Elo: ld1.cla, p2Elo: ld2.cla },
        'classic'
      ),
      wnb: this.calculate(
        { ...normalizedPoints, p1Elo: ld1.wnb, p2Elo: ld2.wnb },
        'weighted'
      ),
      wwb: this.calculate(
        { ...normalizedPoints, p1Elo: ld1.wwb, p2Elo: ld2.wwb },
        'weightedWithBonus'
      ),
      bvf: this.calculateWithVaryingScale(
        { ...normalizedPoints, p1Elo: ld1.bvf, p2Elo: ld2.bvf },
      ),
    }
  }

  private static getNormalizedPoints(match: EloMatchInput): NormalizedPoints {
    const normalizator = this.getNormalizingFunction(match.discipline);
    const normalizedPoints = {
      p1NormalizedPoints: normalizator(match.p1Points),
      p2NormalizedPoints: normalizator(match.p2Points)
    }

    // make sure there is a winner even after normalization.
    if (normalizedPoints.p1NormalizedPoints == normalizedPoints.p2NormalizedPoints) {
      if (match.p1Points > match.p2Points) 
        normalizedPoints.p2NormalizedPoints--
      else 
        normalizedPoints.p1NormalizedPoints--
    }

    return normalizedPoints;
  }

  private static getNormalizingFunction(discipline: PoolDiscipline): (score: number) => number {
    switch (discipline) {
      case '14/1': return (p: number) => Math.floor(p / 12);
      case 'Bank-Pool': return (p: number) => Math.floor(p * 1.5)
      case 'One-Pocket': return (p: number) => p * 2;
      default: return (p: number) => p;
    }
  }

  public static calculate(match: EloCalculationInput, mode: EloMode = 'weightedWithBonus'): number {
    return Math.round(this.K * this.calculateFactor(match, mode));
  }

  public static calculateWithVaryingScale(match: EloCalculationInput, mode: EloMode = 'weightedWithBonus'): number {
    return Math.round(this.getVaryingScaleFactor(match) * this.calculateFactor(match, mode));
  }

  private static getVaryingScaleFactor(match: EloCalculationInput) : number {
    const matchLength = Math.max(match.p1NormalizedPoints, match.p2NormalizedPoints);
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
      ? this.E(match.p1NormalizedPoints, match.p2NormalizedPoints)
      : match.p1NormalizedPoints > match.p2NormalizedPoints
        ? 1
        : 0;

    const bonus = mode === 'weightedWithBonus'
      ? this.Bonus(match.p1NormalizedPoints, match.p2NormalizedPoints)
      : 0;

    return actual + bonus - expected;
  }

  private static Bonus(s1: number, s2:number): number {
    const sign = Math.sign(s1 - s2);
    const max = Math.max(s1, s2);
    return sign * max/(max + this.winBonus);
  }

  private static Q(elo: number): number {
    return Math.pow(10, elo / this.exponentDivisor);
  }

  private static E(q1: number, q2: number): number {
    return q1 / (q1+q2);
  }
}

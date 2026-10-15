import { PoolDiscipline } from './pool-discipline';

export namespace StraightPool {
  export const discipline = '14/1' satisfies PoolDiscipline;
  export const lengths = [30, 40, 50, 75, 100, 125, 150, 200];
  export const defaultLength = 50;
  export const minScore = -100;

  export function is(discipline: PoolDiscipline): boolean {
    return discipline === StraightPool.discipline;
  }

  export function isValidScore(score: number, length: number): boolean {
    return Number.isInteger(score) && score >= minScore && score <= length;
  }

  export function nextLength(length: number): number {
    return lengths.find((l) => l > length) ?? length;
  }

  export function previousLength(length: number): number {
    return [...lengths].reverse().find((l) => l < length) ?? length;
  }
}

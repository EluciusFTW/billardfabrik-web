import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PoolDiscipline } from '../tourney-series/models/pool-discipline';

export class EloMatchValidators {
  public static NoWinnerValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const s1 = control.get('playerOneScore').value;
    const s2 = control.get('playerTwoScore').value;

    return s1 && s1 === s2
      ? { noWinner: true }
      : null;
  };

  public static NotInTheFutureValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let value = new Date(control.value);
    return value > new Date()
      ? { inTheFuture: true }
      : undefined;
  }

  public static MinimumLengthValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const s1 = control.get('playerOneScore').value;
    const s2 = control.get('playerTwoScore').value;

    const mV = EloMatchValidators.minimumLength(control.get('discipline').value);
    return Math.max(s1, s2) < mV
      ? { needed: mV }
      : null;
  };

  public static MinimumRaceLengthValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const mV = EloMatchValidators.minimumLength(control.get('discipline').value);
    return control.get('length').value < mV
      ? { needed: mV }
      : null;
  };

  public static minimumLength(discipline: PoolDiscipline): number {
    switch (discipline) {
      case '14/1': return 50;
      case 'One-Pocket': return 2;
      default: return 3;
    }
  }

  public static DuplicatePlayerValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const p1 = control.get('selectPlayerOne').value;
    const p2 = control.get('selectPlayerTwo').value;

    return p1.length > 0 && p1 === p2
      ? { duplicatePlayer: true }
      : null;
  };
}

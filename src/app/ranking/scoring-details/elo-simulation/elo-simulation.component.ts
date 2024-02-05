import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EloFunctions } from '../../elo-functions';
import { EloDataPoint, EloScores } from '../../models/elo-models';

@Component({
  selector: 'app-elo-simulation',
  templateUrl: './elo-simulation.component.html',
  styleUrls: ['./elo-simulation.component.scss']
})
export class EloSimulationComponent {

  matchForm: FormGroup;
  score: EloScores | null;

  constructor(public dialogRef: MatDialogRef<EloSimulationComponent>) {

    this.matchForm = new FormGroup({
      playerOneElo: new FormControl<number>(1500, [Validators.required, Validators.min(0)]),
      playerTwoElo: new FormControl<number>(1500, [Validators.required, Validators.min(0)]),
      playerOneScore: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
      playerTwoScore: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    },
    { validators: [noWinnerValidator] });
  }

  calculate(): void {
    this.score = EloFunctions.calculateAll({
      p1Points: this.matchForm.value.playerOneScore,
      p2Points: this.matchForm.value.playerTwoScore,
      p1DataPoint: this.createDataPoint(this.matchForm.value.playerOneElo),
      p2DataPoint: this.createDataPoint(this.matchForm.value.playerTwoElo),
    });

    console.log(this.score);
  }

  private createDataPoint(value: number): EloDataPoint {
    return {
      match: '',
      cla: value,
      wwb:value,
      wnb: value,
      bvf: value
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}

const noWinnerValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const s1 = control.get('playerOneScore').value;
  const s2 = control.get('playerTwoScore').value;

  return s1 && s1 === s2
    ? { noWinner: true }
    : null;
};

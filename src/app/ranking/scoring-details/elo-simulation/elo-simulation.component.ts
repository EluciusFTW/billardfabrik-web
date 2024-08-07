import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EloFunctions } from '../../elo-functions';
import { EloDataPoint, EloScores } from '../../models/elo-models';
import { POOL_DISCIPLINES, PoolDiscipline } from 'src/app/tourney-series/models/pool-discipline';
import { EloMatchValidators } from '../../elo-match-validators';

@Component({
  selector: 'app-elo-simulation',
  templateUrl: './elo-simulation.component.html',
  styles: [`
    .error-message {
      padding-left: 1em;
      color: var(--color-error);
      font-size: .75em;
    }
  `]
})
export class EloSimulationComponent {

  disciplines: PoolDiscipline[] =  [ ...POOL_DISCIPLINES ];
  matchForm: FormGroup;
  score: EloScores | null;

  constructor(public dialogRef: MatDialogRef<EloSimulationComponent>) {

    this.matchForm = new FormGroup({
      playerOneElo: new FormControl<number>(1500, [Validators.required, Validators.min(0)]),
      playerTwoElo: new FormControl<number>(1500, [Validators.required, Validators.min(0)]),
      playerOneScore: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
      playerTwoScore: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
      discipline: new FormControl<string>(this.disciplines[0], [Validators.required]),
    },
    { validators: [EloMatchValidators.NoWinnerValidator, EloMatchValidators.MinimumLengthValidator] });
  }

  calculate(): void {
    this.score = EloFunctions.calculateAll({
      discipline: this.matchForm.value.discipline,
      p1Points: this.matchForm.value.playerOneScore,
      p2Points: this.matchForm.value.playerTwoScore,
      p1DataPoint: this.createDataPoint(this.matchForm.value.playerOneElo),
      p2DataPoint: this.createDataPoint(this.matchForm.value.playerTwoElo),
    });
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

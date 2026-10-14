import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { from } from 'rxjs';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { PlayersService } from 'src/app/players/players.service';
import { PlayerFunctions } from 'src/app/players/player-functions';
import { Match } from 'src/app/tourney-series/models/match';
import { MatchPlayer } from 'src/app/tourney-series/models/match-player';
import { MatchStatus } from 'src/app/tourney-series/models/match-status';
import { POOL_DISCIPLINES, PoolDiscipline } from 'src/app/tourney-series/models/pool-discipline';
import { StraightPool } from 'src/app/tourney-series/models/straight-pool';
import { EloMatchValidators } from '../../elo-match-validators';
import { LiveChallenge } from '../../models/live-challenge';

const DEFAULT_RACE_LENGTH = 5;

@Component({
  templateUrl: './create-challenge-dialog.component.html',
  styleUrls: ['./create-challenge-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption, MatInput, MatButton]
})
export class CreateChallengeDialogComponent {

  private readonly dialogRef = inject<MatDialogRef<CreateChallengeDialogComponent, LiveChallenge>>(MatDialogRef);
  private readonly playersService = inject(PlayersService);

  disciplines: PoolDiscipline[] = [...POOL_DISCIPLINES];
  straightPoolLengths = StraightPool.lengths.filter(l => l >= EloMatchValidators.minimumLength(StraightPool.discipline));
  readonly availablePlayers = toSignal(
    from(this.playersService.getEloPlayers().then(players => players.map(PlayerFunctions.displayName))),
    { initialValue: [] });

  challengeForm = new FormGroup(
    { discipline: new FormControl<PoolDiscipline>(this.disciplines[0], [Validators.required]),
      length: new FormControl<number>(DEFAULT_RACE_LENGTH, [Validators.required]),
      selectPlayerOne: new FormControl<string>('', [Validators.required]),
      selectPlayerTwo: new FormControl<string>('', [Validators.required]) },
    { validators: [
      EloMatchValidators.DuplicatePlayerValidator,
      EloMatchValidators.MinimumRaceLengthValidator] });

  private readonly discipline = toSignal(
    this.challengeForm.controls.discipline.valueChanges,
    { initialValue: this.challengeForm.controls.discipline.value });
  readonly isStraightPool = computed(() => StraightPool.is(this.discipline()));

  constructor() {
    this.challengeForm.controls.discipline.valueChanges.subscribe(discipline =>
      this.challengeForm.controls.length.setValue(
        StraightPool.is(discipline) ? StraightPool.defaultLength : DEFAULT_RACE_LENGTH));
  }

  submit(): void {
    const value = this.challengeForm.value;
    this.dialogRef.close({
      ...Match.create(
        { ...MatchPlayer.From(value.selectPlayerOne) },
        { ...MatchPlayer.From(value.selectPlayerTwo) },
        value.discipline,
        value.length),
      status: MatchStatus.inProgress,
      startedAt: new Date().toISOString()
    });
  }

  abort(): void {
    this.dialogRef.close();
  }
}

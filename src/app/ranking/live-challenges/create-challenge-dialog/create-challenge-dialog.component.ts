import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { from } from 'rxjs';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { PlayersService } from 'src/app/players/players.service';
import { PlayerFunctions } from 'src/app/players/player-functions';
import { Match } from 'src/app/tourney-series/models/match';
import { MatchPlayer } from 'src/app/tourney-series/models/match-player';
import { POOL_DISCIPLINES, PoolDiscipline } from 'src/app/tourney-series/models/pool-discipline';
import { StraightPool } from 'src/app/tourney-series/models/straight-pool';
import { EloMatchValidators } from '../../elo-match-validators';
import { LiveChallenge } from '../../models/live-challenge';
import { InningLimit } from '../../straight-pool-scoresheet';

const DEFAULT_RACE_LENGTH = 5;
const DEFAULT_INNING_LIMIT = 30;
const MIN_INNING_LIMIT = 10;
const MAX_INNING_LIMIT = 50;

@Component({
  templateUrl: './create-challenge-dialog.component.html',
  styleUrls: ['./create-challenge-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, ReactiveFormsModule, MatFormField, MatLabel, MatError, MatSelect, MatOption, MatInput, MatButton, MatSlideToggle]
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
      selectPlayerTwo: new FormControl<string>('', [Validators.required]),
      limitInnings: new FormControl<boolean>(false, { nonNullable: true }),
      // only validated while the inning limit is switched on
      inningLimit: new FormControl<number>({ value: DEFAULT_INNING_LIMIT, disabled: true },
        [Validators.required, Validators.min(MIN_INNING_LIMIT), Validators.max(MAX_INNING_LIMIT)]) },
    { validators: [
      EloMatchValidators.DuplicatePlayerValidator,
      EloMatchValidators.MinimumRaceLengthValidator] });

  private readonly discipline = toSignal(
    this.challengeForm.controls.discipline.valueChanges,
    { initialValue: this.challengeForm.controls.discipline.value });
  readonly isStraightPool = computed(() => StraightPool.is(this.discipline()));
  readonly minInningLimit = MIN_INNING_LIMIT;
  readonly maxInningLimit = MAX_INNING_LIMIT;
  readonly limitInnings = toSignal(this.challengeForm.controls.limitInnings.valueChanges, { initialValue: false });

  constructor() {
    this.challengeForm.controls.discipline.valueChanges.subscribe(discipline =>
      this.challengeForm.controls.length.setValue(
        StraightPool.is(discipline) ? StraightPool.defaultLength : DEFAULT_RACE_LENGTH));

    // Only 14/1 is scored inning by inning, so only there the inning limit applies.
    this.challengeForm.valueChanges.subscribe(() => {
      const inningLimit = this.challengeForm.controls.inningLimit;
      const enabled = this.isStraightPool() && this.challengeForm.controls.limitInnings.value;
      if (enabled && inningLimit.disabled) {
        inningLimit.enable({ emitEvent: false });
      } else if (!enabled && inningLimit.enabled) {
        inningLimit.disable({ emitEvent: false });
      }
    });
  }

  submit(): void {
    const value = this.challengeForm.value;
    const inningLimit: InningLimit = this.challengeForm.controls.inningLimit.enabled
      ? { kind: 'limited', innings: value.inningLimit }
      : { kind: 'unlimited' };
    this.dialogRef.close(LiveChallenge.start(
      Match.create(
        { ...MatchPlayer.From(value.selectPlayerOne) },
        { ...MatchPlayer.From(value.selectPlayerTwo) },
        value.discipline,
        value.length),
      inningLimit));
  }

  abort(): void {
    this.dialogRef.close();
  }
}

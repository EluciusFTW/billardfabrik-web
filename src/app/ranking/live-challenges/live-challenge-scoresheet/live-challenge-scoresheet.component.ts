import {
  Component,
  computed,
  effect,
  inject,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput } from '@angular/material/input';
import { AuthorizedComponent } from 'src/app/shared/authorized.component';
import { Db } from 'src/app/shared/firebase-utilities';
import { ContentTileComponent } from '../../../shared/content-tile/content-tile.component';
import { LiveChallengeService } from '../../live-challenge.service';
import {
  LiveChallenge,
  StraightPoolChallenge,
} from '../../models/live-challenge';
import {
  BALLS_IN_RACK,
  BALLS_PER_RERACK,
  PlayerSheet,
  PlayerSide,
  ScoredInning,
  StraightPoolFoul,
  evaluateScoresheet,
  pointsOf,
} from '../../straight-pool-scoresheet';

const MINIMUM_ROWS = 15;

const HIGHLIGHTED_LAST_INNINGS = 3;

type ScoresheetRow = {
  number: number;
  one?: ScoredInning;
  two?: ScoredInning;
  lastInnings: boolean;
};

@Component({
  templateUrl: './live-challenge-scoresheet.component.html',
  styleUrls: ['./live-challenge-scoresheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ContentTileComponent,
    RouterLink,
    ReactiveFormsModule,
    MatButton,
    MatIconButton,
    MatIcon,
    MatFormField,
    MatInput,
  ],
})
export class LiveChallengeScoresheetComponent extends AuthorizedComponent {
  private readonly challengeService = inject(LiveChallengeService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  readonly challenge = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => this.challengeService.get(id)),
      map((challenge): Db<StraightPoolChallenge> | null =>
        challenge && LiveChallenge.isStraightPool(challenge) ? challenge : null,
      ),
    ),
    { initialValue: undefined },
  );

  readonly sheet = computed(() => {
    const challenge = this.challenge();
    return challenge
      ? LiveChallenge.scoresheet(challenge)
      : evaluateScoresheet([], { kind: 'unlimited' });
  });

  readonly isOver = computed(
    () => !!this.challenge() && LiveChallenge.isOver(this.challenge()),
  );

  readonly winner = computed(() =>
    this.isOver() ? LiveChallenge.winner(this.challenge()).name : '',
  );

  readonly limitExtended = computed(() => {
    const limit = this.sheet().inningLimit;
    return limit.kind === 'limited' && limit.extended;
  });

  readonly players = computed<
    { side: PlayerSide; name: string; sheet: PlayerSheet }[]
  >(() => {
    const challenge = this.challenge();
    return challenge
      ? [
          {
            side: 'one',
            name: challenge.playerOne.name,
            sheet: this.sheet().one,
          },
          {
            side: 'two',
            name: challenge.playerTwo.name,
            sheet: this.sheet().two,
          },
        ]
      : [];
  });

  readonly hasInnings = computed(
    () => (this.challenge()?.innings.length ?? 0) > 0,
  );

  readonly rows = computed<ScoresheetRow[]>(() => {
    const { one, two, inningLimit } = this.sheet();
    const limitedRows =
      inningLimit.kind === 'limited' ? inningLimit.innings : 0;
    return Array.from(
      {
        length: Math.max(
          MINIMUM_ROWS,
          limitedRows,
          one.innings.length,
          two.innings.length,
        ),
      },
      (_, index) => ({
        number: index + 1,
        one: one.innings[index],
        two: two.innings[index],
        lastInnings:
          inningLimit.kind === 'limited' &&
          index >= inningLimit.innings - HIGHLIGHTED_LAST_INNINGS &&
          index < inningLimit.innings,
      }),
    );
  });

  inningForm = new FormGroup(
    {
      player: new FormControl<PlayerSide>('one', { nonNullable: true }),
      ballsLeft: new FormControl<number>(BALLS_IN_RACK, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(1),
          Validators.max(BALLS_IN_RACK),
        ],
      }),
      reracks: new FormControl<number>(0, { nonNullable: true }),
    },
    { validators: [(control) => this.validPoints(control)] },
  );

  private readonly inningValue = toSignal(this.inningForm.valueChanges, {
    initialValue: this.inningForm.getRawValue(),
  });

  readonly reracks = computed(() => this.inningValue().reracks ?? 0);

  readonly virtualBallsOnTable = computed(
    () => this.sheet().ballsOnTable + this.reracks() * BALLS_PER_RERACK,
  );

  readonly inningPoints = computed(
    () => this.virtualBallsOnTable() - (this.inningValue().ballsLeft ?? 0),
  );

  readonly atTablePlayer = computed(
    () => this.inningValue().player ?? this.sheet().nextPlayer,
  );

  readonly canChoosePlayer = computed(
    () => this.isLoggedIn() && !this.isOver(),
  );

  readonly atTableName = computed(
    () =>
      this.players().find((player) => player.side === this.atTablePlayer())
        ?.name ?? '',
  );

  private readonly playerTotal = computed(() =>
    this.inningValue().player === 'two'
      ? this.sheet().two.total
      : this.sheet().one.total,
  );

  readonly maxBallsLeft = computed(() =>
    Math.min(BALLS_IN_RACK, this.virtualBallsOnTable()),
  );

  readonly minBallsLeft = computed(() =>
    Math.max(
      1,
      this.virtualBallsOnTable() -
        ((this.challenge()?.length ?? 0) - this.playerTotal()),
    ),
  );
  readonly ballsLeft = computed(() => this.inningValue().ballsLeft ?? 0);

  readonly canFinishRack = computed(
    () =>
      this.playerTotal() + this.virtualBallsOnTable() - 1 <
      (this.challenge()?.length ?? 0),
  );

  readonly isBreak = computed(
    () => (this.challenge()?.innings.length ?? 0) === 0,
  );

  constructor() {
    super();
    effect(() =>
      this.inningForm.reset({
        player: this.sheet().nextPlayer,
        ballsLeft: this.sheet().ballsOnTable,
        reracks: 0,
      }),
    );
  }

  choosePlayer(player: PlayerSide): void {
    this.inningForm.controls.player.setValue(player);
  }

  changeBallsLeft(delta: number): void {
    const ballsLeft = Math.min(
      this.maxBallsLeft(),
      Math.max(this.minBallsLeft(), this.ballsLeft() + delta),
    );
    this.inningForm.controls.ballsLeft.setValue(ballsLeft);
  }

  changeReracks(delta: number): void {
    const reracks = Math.max(0, this.inningForm.controls.reracks.value + delta);
    this.inningForm.patchValue({
      reracks,
      ballsLeft: reracks > 0 ? BALLS_IN_RACK : this.sheet().ballsOnTable,
    });
  }

  endInning(
    challenge: Db<StraightPoolChallenge>,
    foul: StraightPoolFoul,
  ): Promise<void> {
    return this.challengeService.addInning(challenge, {
      ...this.inningForm.getRawValue(),
      foul,
    });
  }

  removeLastInning(challenge: Db<StraightPoolChallenge>): Promise<void> {
    return this.challengeService.removeLastInning(challenge);
  }

  async complete(challenge: Db<StraightPoolChallenge>): Promise<void> {
    await this.challengeService.complete(challenge);
    await this.router.navigate(['ranking', 'live']);
  }

  private validPoints(control: AbstractControl): ValidationErrors | null {
    const challenge = this.challenge?.();
    if (!challenge) {
      return null;
    }

    const { player, ballsLeft, reracks } = control.value;
    const sheet = this.sheet();
    if (
      sheet.inningLimit.kind === 'limited' &&
      sheet[player as PlayerSide].innings.length >= sheet.inningLimit.innings
    ) {
      return { noInningsLeft: true };
    }

    const points = pointsOf({ ballsLeft, reracks }, this.sheet().ballsOnTable);
    if (points < 0) {
      return { moreBallsThanOnTable: true };
    }

    const total =
      player === 'one' ? this.sheet().one.total : this.sheet().two.total;
    return total + points > challenge.length
      ? { beyondRaceLength: challenge.length - total }
      : null;
  }
}

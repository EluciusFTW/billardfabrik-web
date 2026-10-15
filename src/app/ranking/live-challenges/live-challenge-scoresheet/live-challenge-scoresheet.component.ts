import { Component, computed, effect, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput } from '@angular/material/input';
import { AuthorizedComponent } from 'src/app/shared/authorized.component';
import { Db } from 'src/app/shared/firebase-utilities';
import { ContentTileComponent } from '../../../shared/content-tile/content-tile.component';
import { LiveChallengeService } from '../../live-challenge.service';
import { LiveChallenge } from '../../models/live-challenge';
import { BALLS_IN_RACK, BALLS_PER_RERACK, PlayerSheet, PlayerSide, ScoredInning, StraightPoolFoul, evaluateScoresheet, pointsOf } from '../../straight-pool-scoresheet';

const MINIMUM_ROWS = 15;

const HIGHLIGHTED_LAST_INNINGS = 3;

type ScoresheetRow = { number: number; one?: ScoredInning; two?: ScoredInning; lastInnings: boolean };

@Component({
  templateUrl: './live-challenge-scoresheet.component.html',
  styleUrls: ['./live-challenge-scoresheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent, RouterLink, ReactiveFormsModule, MatButton, MatIconButton, MatIcon, MatFormField, MatInput]
})
export class LiveChallengeScoresheetComponent extends AuthorizedComponent {

  private readonly challengeService = inject(LiveChallengeService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  // undefined while loading, null once the challenge is gone
  readonly challenge = toSignal(
    toObservable(this.id).pipe(switchMap(id => this.challengeService.get(id))),
    { initialValue: undefined });

  readonly sheet = computed(() => {
    const challenge = this.challenge();
    return challenge ? LiveChallenge.scoresheet(challenge) : evaluateScoresheet([]);
  });
  readonly isOver = computed(() => !!this.challenge() && LiveChallenge.isOver(this.challenge()));
  readonly winner = computed(() => this.isOver() ? LiveChallenge.winner(this.challenge()).name : '');
  // the limit was extended by 5 innings because the score was tied
  readonly limitExtended = computed(() =>
    this.sheet().inningLimit !== undefined && this.sheet().inningLimit !== this.challenge()?.inningLimit);
  readonly players = computed<{ side: PlayerSide; name: string; sheet: PlayerSheet }[]>(() => {
    const challenge = this.challenge();
    return challenge
      ? [{ side: 'one', name: challenge.playerOne.name, sheet: this.sheet().one },
         { side: 'two', name: challenge.playerTwo.name, sheet: this.sheet().two }]
      : [];
  });
  readonly hasInnings = computed(() => (this.challenge()?.innings?.length ?? 0) > 0);

  // Each player's innings are numbered on their own, like on a paper scoresheet, which also
  // starts out with a number of empty rows - all of them with an inning limit. The last three
  // innings before the limit are highlighted.
  readonly rows = computed<ScoresheetRow[]>(() => {
    const { one, two, inningLimit } = this.sheet();
    return Array.from(
      { length: Math.max(MINIMUM_ROWS, inningLimit ?? 0, one.innings.length, two.innings.length) },
      (_, index) => ({
        number: index + 1,
        one: one.innings[index],
        two: two.innings[index],
        lastInnings: inningLimit !== undefined && index >= inningLimit - HIGHLIGHTED_LAST_INNINGS && index < inningLimit
      }));
  });

  inningForm = new FormGroup(
    { player: new FormControl<PlayerSide>('one', { nonNullable: true }),
      ballsLeft: new FormControl<number>(BALLS_IN_RACK, { nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(BALLS_IN_RACK)] }),
      reracks: new FormControl<number>(0, { nonNullable: true }) },
    { validators: [control => this.validPoints(control)] });

  private readonly inningValue = toSignal(this.inningForm.valueChanges, { initialValue: this.inningForm.getRawValue() });
  readonly reracks = computed(() => this.inningValue().reracks ?? 0);
  readonly virtualBallsOnTable = computed(() => this.sheet().ballsOnTable + this.reracks() * BALLS_PER_RERACK);
  readonly inningPoints = computed(() => this.virtualBallsOnTable() - (this.inningValue().ballsLeft ?? 0));
  readonly atTablePlayer = computed(() => this.inningValue().player ?? this.sheet().nextPlayer);
  readonly canChoosePlayer = computed(() => this.isLoggedIn() && !this.isOver());
  readonly atTableName = computed(() => this.players().find(player => player.side === this.atTablePlayer())?.name ?? '');
  private readonly playerTotal = computed(() => this.inningValue().player === 'two' ? this.sheet().two.total : this.sheet().one.total);

  // Range for the +/- buttons: no more balls left than on the table (0 points), and not so few
  // that the points go beyond the race length.
  readonly maxBallsLeft = computed(() => Math.min(BALLS_IN_RACK, this.virtualBallsOnTable()));
  readonly minBallsLeft = computed(() => Math.max(1,
    this.virtualBallsOnTable() - ((this.challenge()?.length ?? 0) - this.playerTotal())));
  readonly ballsLeft = computed(() => this.inningValue().ballsLeft ?? 0);

  // The rack can only be finished if pocketing all but one ball does not already reach the race length.
  readonly canFinishRack = computed(() =>
    this.playerTotal() + this.virtualBallsOnTable() - 1 < (this.challenge()?.length ?? 0));

  // A breaking violation (-2) can only happen on the opening break, i.e. in the very first inning.
  readonly isBreak = computed(() => (this.challenge()?.innings?.length ?? 0) === 0);

  constructor() {
    super();
    // Whenever an inning was added or removed, suggest the player who is at the table next
    // and start from the balls currently on the table, i.e. a miss without points.
    effect(() => this.inningForm.reset({
      player: this.sheet().nextPlayer,
      ballsLeft: this.sheet().ballsOnTable,
      reracks: 0
    }));
  }

  // The player at the table is suggested, but can be switched, e.g. when the opponent of a
  // breaking violation has the offender break again.
  choosePlayer(player: PlayerSide): void {
    this.inningForm.controls.player.setValue(player);
  }

  changeBallsLeft(delta: number): void {
    const ballsLeft = Math.min(this.maxBallsLeft(), Math.max(this.minBallsLeft(), this.ballsLeft() + delta));
    this.inningForm.controls.ballsLeft.setValue(ballsLeft);
  }

  // A finished rack means the player continues on a fresh rack of 15, so the balls left start from
  // there; without any re-rack they start from the balls that were on the table before the inning.
  changeReracks(delta: number): void {
    const reracks = Math.max(0, this.inningForm.controls.reracks.value + delta);
    this.inningForm.patchValue({
      reracks,
      ballsLeft: reracks > 0 ? BALLS_IN_RACK : this.sheet().ballsOnTable
    });
  }

  // Every way to end the turn records the inning: a miss or safety, a foul, or a breaking violation.
  endInning(challenge: Db<LiveChallenge>, foul: StraightPoolFoul): Promise<void> {
    return this.challengeService.addInning(challenge, { ...this.inningForm.getRawValue(), foul });
  }

  removeLastInning(challenge: Db<LiveChallenge>): Promise<void> {
    return this.challengeService.removeLastInning(challenge);
  }

  async complete(challenge: Db<LiveChallenge>): Promise<void> {
    await this.challengeService.complete(challenge);
    await this.router.navigate(['ranking', 'challenges']);
  }

  private validPoints(control: AbstractControl): ValidationErrors | null {
    // Runs once while the form is built, before the signals below exist.
    const challenge = this.challenge?.();
    if (!challenge) {
      return null;
    }

    const { player, ballsLeft, reracks } = control.value;
    const sheet = this.sheet();
    if (sheet.inningLimit !== undefined && sheet[player as PlayerSide].innings.length >= sheet.inningLimit) {
      return { noInningsLeft: true };
    }

    const points = pointsOf({ ballsLeft, reracks }, this.sheet().ballsOnTable);
    if (points < 0) {
      return { moreBallsThanOnTable: true };
    }

    const total = player === 'one' ? this.sheet().one.total : this.sheet().two.total;
    return total + points > challenge.length
      ? { beyondRaceLength: challenge.length - total }
      : null;
  }
}

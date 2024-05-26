import { Component, EventEmitter, Output, computed, input } from '@angular/core';
import { Match } from '../models/match';
import { MatchStatus } from '../models/match-status';
import { MatchPlayer } from '../models/match-player';
import { TourneyPhaseEvent } from '../models/tourney-phase-event';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss', '../tourneys.scss']
})
export class MatchComponent {

  match = input.required<Match>();
  disabled = input<boolean>(false);

  cancelled = computed(() => this.match().status === MatchStatus.cancelled);
  uncancellable = computed(() => !this.disabled() && this.cancelled());
  cancellable = computed(() =>
    !this.disabled()
    && !this.cancelled()
    && !Match.hasStarted(this.match()));

  scoreEditDisabled = computed(() =>
    this.disabled()
    || this.cancelled()
    || this.match().status === MatchStatus.done);

  isWalk = computed(() => MatchPlayer.isWalk(this.match().playerTwo) || MatchPlayer.isWalk(this.match().playerOne));

  matchClass = computed(() => {
      if (this.disabled()) {
        return '';
      } else if (this.cancelled()) {
        return 'cancelled';
      } else if (Match.hasStarted(this.match())) {
        return 'notStarted';
      } else if (Match.isOver(this.match())) {
        return 'running';
      }
      return 'gameOver';
    })

  plusDisabledP1 = computed(() =>
    this.match().playerOne.points >= this.match().length
    || (this.match().playerTwo.points === this.match().length && this.match().playerOne.points === this.match().length - 1));
  plusDisabledP2 = computed(() =>
    this.match().playerTwo.points >= this.match().length
    || (this.match().playerOne.points === this.match().length && this.match().playerTwo.points === this.match().length - 1));

  minusDisabledP1 = computed (() => this.match().playerOne.points === 0);
  minusDisabledP2 = computed (() => this.match().playerTwo.points === 0);

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();

  // cancel(): void {
  //   this.match().playerOne.points = 0;
  //   this.match().playerTwo.points = 0;
  //   this.match().status = MatchStatus.cancelled;
  //   this.change.emit({ type: 'ScoreChanged' });
  // }

  // uncancel(): void {
  //   this.match().status = MatchStatus.notStarted;
  //   this.change.emit({ type: 'ScoreChanged' });
  // }

  getVisibility(status: boolean) {
    return status
      ? 'hidden'
      : 'inherit';
  }

  plus(player: MatchPlayer): void {
    player.points++;
    this.change.emit({ type: 'ScoreChanged' });
  }

  minus(player: MatchPlayer): void {
    player.points--;
    this.change.emit({ type: 'ScoreChanged' });
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Input({ required: true })
  match: Match

  @Input()
  disabled: boolean = false;

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();

  scoreEditDisabled(): boolean {
    return this.disabled
      || this.cancelled()
      || this.match.status === MatchStatus.done;
  }

  cancelled(): boolean {
    return this.match.status === MatchStatus.cancelled;
  }

  cancellable(): boolean {
    return !this.disabled
      && !this.cancelled()
      && !Match.hasStarted(this.match);
  }

  uncancellable(): boolean {
    return !this.disabled
      && this.cancelled();
  }

  cancel(): void {
    this.match.playerOne.points = 0;
    this.match.playerTwo.points = 0;
    this.match.status = MatchStatus.cancelled;
    this.change.emit({ type: 'ScoreChanged' });
  }

  uncancel(): void {
    this.match.status = MatchStatus.notStarted;
    this.change.emit({ type: 'ScoreChanged' });
  }

  plusDisabled(who: number): boolean {
    return who === 1
      ? this.match.playerOne.points >= this.match.length || (this.match.playerTwo.points === this.match.length && this.match.playerOne.points === this.match.length - 1)
      : this.match.playerTwo.points >= this.match.length || (this.match.playerOne.points === this.match.length && this.match.playerTwo.points === this.match.length - 1)
  }

  minusDisabled(who: number): boolean {
    return who === 1
      ? this.match.playerOne.points === 0
      : this.match.playerTwo.points === 0;
  }

  getVisibility(status: boolean) {
    return status
      ? 'hidden'
      : 'inherit';
  }

  get matchClass(): string {
    if (this.disabled) {
      return '';
    } else if (this.cancelled()) {
      return 'cancelled';
    } else if (!Match.hasStarted(this.match)) {
      return 'notStarted';
    } else if (!Match.isOver(this.match)) {
      return 'running';
    }

    return 'gameOver';
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

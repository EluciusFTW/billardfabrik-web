import { Component, EventEmitter, inject, input, computed, Output } from '@angular/core';
import { Match } from '../models/match';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import {TourneyPhaseEvent } from '../models/tourney-phase-event';
import { MatchStatus } from '../models/match-status';
import { TourneyEliminationStage } from '../models/tourney-elimination-stage';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';
import { TourneyDoubleEliminationStageType } from '../models/tourney-double-elimination-stage-type';
import { UserService } from 'src/app/authentication/user.service';

@Component({
  selector: 'app-tourney-elimination-stage',
  templateUrl: './tourney-elimination-stage.component.html',
  styleUrls: ['../tourneys.scss']
})
export class TourneyEliminationStageComponent {
  private userService = inject(UserService);

  stage = input.required<TourneyEliminationStage>();
  stageCompleted = computed(() => this.stage().status == TourneyPhaseStatus.finalized);
  stageActive = computed(() => this.stage().status === TourneyPhaseStatus.readyOrOngoing);
  allGamesOver = computed(() => this.stage().matches
    .filter(match => match.status !== MatchStatus.cancelled)
    .findIndex(match => !Match.isOver(match)) === -1 );

  @Output() change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();

  emitChange($event: TourneyPhaseEvent): void {
    this.change.emit($event);
  }

  increaseLength(): void {
    this.stage().matches.forEach(match => match.length++);
  }

  decreaseLength(): void {
    this.stage().matches.forEach(match => match.length--);
  }

  finalize(): void {
    if (!this.allGamesOver()) {
      return;
    }

    this.stage().status = TourneyPhaseStatus.finalized;
    this.stage().matches
      .filter(match => match.status !== MatchStatus.cancelled)
      .forEach(match => match.status = MatchStatus.done);

    const event = this.stage().eliminationType == 'Single'
      ? ({
        type: 'SingleEliminationStageFinalized',
        stage: this.stage().type as TourneyEliminationStageType
      })
      : ({
        type: 'DoubleEliminationStageFinalized',
        stage: this.stage().type as TourneyDoubleEliminationStageType
      })

    this.change.emit(event as TourneyPhaseEvent);
  }

  canHandleTourney(): boolean {
    return this.userService.canHandleTourneys();
  }
}

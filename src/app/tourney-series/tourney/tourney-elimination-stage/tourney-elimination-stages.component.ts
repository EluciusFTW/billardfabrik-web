import { Component, Output, EventEmitter, input, ChangeDetectionStrategy } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';
import { TourneyEliminationStageComponent } from '../../tourney-elimination-stage/tourney-elimination-stage.component';

@Component({
  selector: 'app-tourney-elimination-stages',
  templateUrl: './tourney-elimination-stages.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TourneyEliminationStageComponent]
})
export class TourneyEliminationStagesComponent {

  tourney = input.required<Tourney>();

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();

  emitChange(event: TourneyPhaseEvent): void {
    this.change.emit(event);
  }
}

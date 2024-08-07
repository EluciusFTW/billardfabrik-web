import { Component, Output, EventEmitter, input } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';

@Component({
  selector: 'app-tourney-elimination-stages',
  templateUrl: './tourney-elimination-stages.component.html'
})
export class TourneyEliminationStagesComponent {

  tourney = input.required<Tourney>();

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();

  emitChange(event: TourneyPhaseEvent): void {
    this.change.emit(event);
  }
}

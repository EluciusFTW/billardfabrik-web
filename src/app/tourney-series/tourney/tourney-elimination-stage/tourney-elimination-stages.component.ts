import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';

@Component({
  selector: 'app-tourney-elimination-stages',
  templateUrl: './tourney-elimination-stages.component.html'
})
export class TourneyEliminationStagesComponent {

  @Input({ required: true })
  tourney: Tourney;

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();

  emitChange(event: TourneyPhaseEvent): void {
    this.change.emit(event);
  }
}

import { Component, EventEmitter, Output, input } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';

@Component({
  selector: 'app-tourney-group-stage',
  templateUrl: './tourney-group-stage.component.html'
})
export class TourneyGroupStageComponent {

  tourney = input.required<Tourney>();

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();

  emitChange(event: TourneyPhaseEvent): void {
    this.change.emit(event);
  }
}

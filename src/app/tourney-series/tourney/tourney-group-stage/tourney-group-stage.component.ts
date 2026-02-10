import { Component, EventEmitter, Output, input } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';
import { MaterialModule } from 'src/app/material/material.module';
import { TourneyGroupComponent } from '../../tourney-group/tourney-group.component';

@Component({
  selector: 'app-tourney-group-stage',
  templateUrl: './tourney-group-stage.component.html',
  imports: [MaterialModule, TourneyGroupComponent]
})
export class TourneyGroupStageComponent {

  tourney = input.required<Tourney>();

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();

  emitChange(event: TourneyPhaseEvent): void {
    this.change.emit(event);
  }
}

import { Component, EventEmitter, Output, input, ChangeDetectionStrategy } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { TourneyGroupComponent } from '../../tourney-group/tourney-group.component';

@Component({
  selector: 'app-tourney-group-stage',
  templateUrl: './tourney-group-stage.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatTabGroup, MatTab, TourneyGroupComponent]
})
export class TourneyGroupStageComponent {

  tourney = input.required<Tourney>();

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();

  emitChange(event: TourneyPhaseEvent): void {
    this.change.emit(event);
  }
}

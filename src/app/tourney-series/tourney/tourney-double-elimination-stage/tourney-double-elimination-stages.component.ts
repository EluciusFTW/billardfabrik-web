import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';

@Component({
  selector: 'app-tourney-double-elimination-stages',
  templateUrl: './tourney-double-elimination-stages.component.html',
  styleUrls: ['./tourney-double-elimination-stages.component.scss']
})
export class TourneyDoubleEliminationStagesComponent {

  @Input()
  tourney: Tourney;

  @Output()
  change: EventEmitter<any> = new EventEmitter();

  emitChange(event: TourneyPhaseEvent): void {
    this.change.emit(event);
  }
}

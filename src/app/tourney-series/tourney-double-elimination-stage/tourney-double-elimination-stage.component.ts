import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TourneyDoubleEliminationStage } from '../models/tourney-double-elimination-stage';

@Component({
  selector: 'app-tourney-double-elimination-stage',
  templateUrl: './tourney-double-elimination-stage.component.html',
})
export class TourneyDoubleEliminationStageComponent {

  @Input()
  stage: TourneyDoubleEliminationStage

  @Output()
  change: EventEmitter<any> = new EventEmitter();
}

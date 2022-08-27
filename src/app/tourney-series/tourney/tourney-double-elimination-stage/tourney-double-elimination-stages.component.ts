import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyDoubleEliminationStageType } from '../../models/tourney-double-elimination-stage-type';
import { TourneyEliminationStage } from '../../models/tourney-elimination-stage';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';

@Component({
  selector: 'app-tourney-double-elimination-stages',
  templateUrl: './tourney-double-elimination-stages.component.html'
})
export class TourneyDoubleEliminationStagesComponent {

  @Input()
  tourney: Tourney;

  @Output()
  change: EventEmitter<any> = new EventEmitter();

  winnerStages(): TourneyEliminationStage[] {
    return this.tourney?.doubleEliminationStages?.filter(stage => TourneyDoubleEliminationStageType.isWinnerStage(stage.type));
  }

  looserStages(): TourneyEliminationStage[] {
    return this.tourney?.doubleEliminationStages?.filter(stage => TourneyDoubleEliminationStageType.isLooserStage(stage.type));
  }

  entryStage(): TourneyEliminationStage {
    return this.tourney?.doubleEliminationStages?.filter(stage => TourneyDoubleEliminationStageType.isEntryStage(stage.type))[0];
  }


  emitChange(event: TourneyPhaseEvent): void {
    this.change.emit(event);
  }
}

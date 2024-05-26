import { Component, EventEmitter, Output, computed, input } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyDoubleEliminationStageType } from '../../models/tourney-double-elimination-stage-type';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';

@Component({
  selector: 'app-tourney-double-elimination-stages',
  templateUrl: './tourney-double-elimination-stages.component.html'
})
export class TourneyDoubleEliminationStagesComponent {

  tourney = input.required<Tourney>();

  @Output()
  change: EventEmitter<any> = new EventEmitter();

  winnerStages = computed(() => this.tourney().doubleEliminationStages?.filter(stage => TourneyDoubleEliminationStageType.isWinnerStage(stage.type)));
  loserStages = computed(() => this.tourney().doubleEliminationStages?.filter(stage => TourneyDoubleEliminationStageType.isLoserStage(stage.type)));
  entryStage = computed(() => this.tourney().doubleEliminationStages?.filter(stage => TourneyDoubleEliminationStageType.isEntryStage(stage.type))[0]);

  emitChange(event: TourneyPhaseEvent): void {
    this.change.emit(event);
  }
}

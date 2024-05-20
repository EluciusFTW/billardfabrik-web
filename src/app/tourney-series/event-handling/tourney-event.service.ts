import { Injectable } from '@angular/core';
import { Tourney } from '../models/tourney';
import { TourneyPhaseEvent } from '../models/tourney-phase-event';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { TourneyStatus } from '../models/tourney-status';
import { TourneyDoubleEliminationStageType } from '../models/tourney-double-elimination-stage-type';
import { handleSingleEliminationStageFinalized } from './single-elimination-stage-finalized.functions';
import { handleDoubleEliminationStageFinalized } from './double-elimination-stage-finalized.functions';
import { handleGroupStageFinalized } from './group-stage-finalized.functions';

@Injectable()
export class TourneyEventService {

  apply(tourney: Tourney, event: TourneyPhaseEvent): void {
    switch (event.type) {
      case 'Started': {
        this.startTourney(tourney);
        return;
      }
      case 'GroupFinalized': {
        handleGroupStageFinalized(tourney);
        return;
      }
      case 'SingleEliminationStageFinalized': {
        handleSingleEliminationStageFinalized(tourney, event.stage);
        return;
      }
      case 'DoubleEliminationStageFinalized': {
        handleDoubleEliminationStageFinalized(tourney, event.stage);
        return;
      }
      case 'ResultsPostProcessed': {
        tourney.meta.status = TourneyStatus.postProcessed;
        return;
      }
    }
  }

  startTourney(tourney: Tourney) {
    tourney.meta.status = TourneyStatus.ongoing;
    if (tourney.meta.modus === 'Gruppe + Einfach-K.O.') {
      tourney.groups.forEach(group => group.status = TourneyPhaseStatus.readyOrOngoing);
    } else if (tourney.meta.modus === 'Einfach-K.O.') {
      tourney.eliminationStages[0].status = TourneyPhaseStatus.readyOrOngoing;
    } else if (tourney.meta.modus === 'Doppel-K.O.') {
      const entryStage = tourney.doubleEliminationStages
        .filter(stage => TourneyDoubleEliminationStageType.isEntryStage(stage.type))
        .sort((s1, s2) => s1.type - s2.type)[0];

      entryStage.status = TourneyPhaseStatus.readyOrOngoing;
    }
    else {
      throw new Error('This mode is not supported yet.')
    }
  }
}

import { Injectable } from '@angular/core';
import { Tourney } from '../models/tourney';
import { DoubleEliminationStageFinalizedEvent, SingleEliminationStageFinalizedEvent, TourneyPhaseEvent } from '../models/tourney-phase-event';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { TourneyStatus } from '../models/tourney-status';
import { TourneyDoubleEliminationStageType } from '../models/tourney-double-elimination-stage-type';
import { SingleEliminationStageFinalizedFunctions } from './single-elimination-stage-finalized.functions';
import { DoubleEliminationStageFinalizedFunctions } from './double-elimination-stage-finalized.functions';
import { GroupStageFinalizedFunctions } from './group-stage-finalized.Functions';

@Injectable()
export class TourneyEventService {

  apply(tourney: Tourney, event: TourneyPhaseEvent): void {
    switch (event.type) {
      case 'Started': {
        this.startTourney(tourney);
        return;
      }
      case 'GroupFinalized': {
        GroupStageFinalizedFunctions.handle(tourney);
        return;
      }
      case 'SingleEliminationStageFinalized': {
        const finalizedStage = (event as SingleEliminationStageFinalizedEvent).stage;
        SingleEliminationStageFinalizedFunctions.handle(tourney, finalizedStage);
        return;
      }
      case 'DoubleEliminationStageFinalized': {
        const finalizedStage = (event as DoubleEliminationStageFinalizedEvent).stage;
        DoubleEliminationStageFinalizedFunctions.handle(tourney, finalizedStage);
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
    }
    else if (tourney.meta.modus === 'Doppel-K.O.') {
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

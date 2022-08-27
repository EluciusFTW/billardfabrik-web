import { Injectable } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { DoubleEliminationStageFinalizedEvent, SingleEliminationStageFinalizedEvent, TourneyPhaseEvent } from '../../models/tourney-phase-event';
import { TourneyPhaseStatus } from '../../models/tourney-phase-status';
import { TourneyStatus } from '../../models/tourney-status';
import { SingleEliminationStageFinalizedService } from './single-elimination-stage-finalized.service';
import { GroupStageFinalizedService } from './group-stage-finalized.service';
import { DoubleEliminationStageFinalizedService } from './double-elimination-stage-finalized.service';
import { TourneyDoubleEliminationStageType } from '../../models/tourney-double-elimination-stage-type';
import { TourneyMode } from '../../models/tourney-mode';

@Injectable()
export class TourneyEventService {

  constructor(
    private groupStageFinalizedService: GroupStageFinalizedService,
    private eliminationStageFinalizedService: SingleEliminationStageFinalizedService,
    private doubleEliminationStageFinalizedService: DoubleEliminationStageFinalizedService) { }

  apply(tourney: Tourney, event: TourneyPhaseEvent): void {
    console.log('Received event: ', event);
    switch (event.type) {
      case 'Started': {
        this.startTourney(tourney);
        return;
      }
      case 'GroupFinalized': {
        this.groupStageFinalizedService.handle(tourney);
        return;
      }
      case 'SingleEliminationStageFinalized': {
        const finalizedStage = (event as SingleEliminationStageFinalizedEvent).stage;
        this.eliminationStageFinalizedService.handle(tourney, finalizedStage);
        return;
      }
      case 'DoubleEliminationStageFinalized': {
        const finalizedStage = (event as DoubleEliminationStageFinalizedEvent).stage;
        this.doubleEliminationStageFinalizedService.handle(tourney, finalizedStage);
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
    if (tourney.meta.modus === TourneyMode.GruopsThenSingleElimination) {
      tourney.groups.forEach(group => group.status = TourneyPhaseStatus.readyOrOngoing);
    }
    else if (tourney.meta.modus === TourneyMode.DoubleElimination) {
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

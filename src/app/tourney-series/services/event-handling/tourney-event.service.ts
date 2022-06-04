import { Injectable } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { DoubleEliminationStageFinalizedEvent, SingleEliminationStageFinalizedEvent, TourneyPhaseEvent } from '../../models/tourney-phase-event';
import { TourneyPhaseStatus } from '../../models/tourney-phase-status';
import { TourneyStatus } from '../../models/tourney-status';
import { SingleEliminationStageFinalizedService } from './single-elimination-stage-finalized.service';
import { GroupStageFinalizedService } from './group-stage-finalized.service';
import { DoubleEliminationStageFinalizedService } from './double-elimination-stage-finalized.service';

@Injectable()
export class TourneyEventService {

  constructor(
    private groupStageFinalizedService: GroupStageFinalizedService,
    private eliminationStageFinalizedService: SingleEliminationStageFinalizedService,
    private doubleEliminationStageFinalizedService: DoubleEliminationStageFinalizedService)
  { }

  apply(tourney: Tourney, event: TourneyPhaseEvent): void {
    switch (event.type) {
      case 'Started': {
        this.startTourney(tourney);
        return;
      }
      case 'GroupFinalized' : {
        this.groupStageFinalizedService.handle(tourney);
        return;
      }
      case 'SingleEliminationStageFinalized' : {
        const finalizedStage = (event as SingleEliminationStageFinalizedEvent).stage;
        this.eliminationStageFinalizedService.handle(tourney, finalizedStage);
        return;
      }
      case 'DoubleEliminationStageFinalized' : {
        const finalizedStage = (event as DoubleEliminationStageFinalizedEvent).stage;
        this.doubleEliminationStageFinalizedService.handle(tourney, finalizedStage);
        return;
      }

      case 'ResultsPostProcessed' : {
        tourney.meta.status = TourneyStatus.postProcessed;
        return;
      }
    }
  }

  startTourney(tourney: Tourney) {
    tourney.meta.status = TourneyStatus.ongoing;
    tourney.groups.forEach(group => group.status = TourneyPhaseStatus.readyOrOngoing);
  }
}

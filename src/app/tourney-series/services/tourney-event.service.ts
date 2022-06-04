import { Injectable } from '@angular/core';
import { Tourney } from '../models/tourney';
import { TourneyPhaseEvent } from '../models/tourney-phase-event';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { TourneyStatus } from '../models/tourney-status';
import { TourneyEliminationStageFinalizedService } from './tourney-elimination-stage-finalized.service';
import { TourneyGroupStageFinalizedService } from './tourney-group-stage-finalized.service';

@Injectable({
  providedIn: 'root'
})
export class TourneyEventService {

  constructor(
    private groupStageFinalizedService: TourneyGroupStageFinalizedService,
    private eliminationStageFinalizedService: TourneyEliminationStageFinalizedService)
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
        this.eliminationStageFinalizedService.handle(tourney);
        return;
      }
      case 'DoubleEliminationStageFinalized' : {
        this.eliminationStageFinalizedService.handle(tourney);
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

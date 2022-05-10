import { Injectable } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyEliminationStageType } from '../../models/tourney-elimination-stage';
import { DoubleEliminationTourneyInfo } from '../../models/tourney-info';
import { DoubleEliminationStageCreationService } from './double-elimination-stage-creation.service';
import { SingleEliminationCreationService } from './single-elimination-creation.service';

@Injectable({
  providedIn: 'root'
})
export class DoubleEliminationCreationService {

  constructor(
    private singleEliminationStageCreationService: SingleEliminationCreationService,
    private doubleEliminationStageCreationService: DoubleEliminationStageCreationService) { }

  create(info: DoubleEliminationTourneyInfo): Tourney {
    // let firstEliminationStage = info.firstEliminationStage;
    let doubleEliminationDownTo = TourneyEliminationStageType.numberOfPlayers(info.firstEliminationStage);

    return {
      doubleEliminationStages: this.doubleEliminationStageCreationService.create(info, doubleEliminationDownTo),
      // eliminationStages: this.singleEliminationStageCreationService.create(info, firstEliminationStage)
    }
  }
}

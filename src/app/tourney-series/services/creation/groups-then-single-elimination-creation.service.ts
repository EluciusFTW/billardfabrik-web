import { Injectable } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { GroupsThenSingleEliminationTourneyInfo } from '../../models/tourney-info';
import { TourneyEliminationStageType } from '../../models/tourney-single-elimination-stage-type';
import { GroupsCreationService } from './groups-creation.service';
import { SingleEliminationCreationService } from './single-elimination-creation.service';

@Injectable()
export class GroupsThenSingleEliminationCreationService {

  constructor(
    private groupStageCreationService: GroupsCreationService,
    private eliminationStageCreationService: SingleEliminationCreationService) { }

  create(info: GroupsThenSingleEliminationTourneyInfo) {
    return {
      groups: this.groupStageCreationService.create(info),
      eliminationStages: this.eliminationStageCreationService.createAllEmpty(info, this.determineStartingStage(info))
    }
  }

  private determineStartingStage(info: GroupsThenSingleEliminationTourneyInfo): TourneyEliminationStageType {
    return info.nrOfGroups === 8
      ? TourneyEliminationStageType.last32
      : info.nrOfGroups >= 4
        ? TourneyEliminationStageType.quarterFinal
        : info.nrOfGroups >= 2
          ? TourneyEliminationStageType.semiFinal
          : TourneyEliminationStageType.final;
  }
}

import { Injectable } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyEliminationStageType } from '../../models/tourney-elimination-stage';
import { GroupsThenSingleEliminationTourneyInfo, TourneyInfo } from '../../models/tourney-info';
import { TourneyMode } from '../../models/tourney-mode';
import { GroupsCreationService } from './groups-creation.service';
import { SingleEliminationCreationService } from './single-elimination-creation.service';

@Injectable()
export class GroupsThenSingleEliminationCreationService {

  constructor(
    private groupStageCreationService: GroupsCreationService,
    private eliminationStageCreationService: SingleEliminationCreationService) {  }

  create(info: GroupsThenSingleEliminationTourneyInfo) : Tourney {

    return {
      groups: this.groupStageCreationService.create(info),
      eliminationStages: this.eliminationStageCreationService.createAllEmpty(info, this.determineStartingStage(info))
    }
  }

  private determineStartingStage(info: TourneyInfo): TourneyEliminationStageType {
    if (info.mode === TourneyMode.GruopsThenSingleElimination) {
      return info.nrOfGroups === 8
        ? TourneyEliminationStageType.last32
        : info.nrOfGroups >= 4
          ? TourneyEliminationStageType.quarterFinal
          : info.nrOfGroups >= 2
            ? TourneyEliminationStageType.semiFinal
            : TourneyEliminationStageType.final;
    }

    return TourneyEliminationStageType.final;
  }
}

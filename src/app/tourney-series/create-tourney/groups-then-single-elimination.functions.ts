import { GroupsThenSingleEliminationTourneyInfo } from '../models/tourney-info';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';
import { GroupsFunctions } from './groups.functions';
import { SingleEliminationFunctions } from './single-elimination.functions';

export class GroupsThenSingleEliminationFunctions {

  static create(info: GroupsThenSingleEliminationTourneyInfo) {
    return {
      groups: GroupsFunctions.create(info),
      eliminationStages: SingleEliminationFunctions.createAllEmpty(info, this.determineStartingStage(info))
    }
  }

  private static determineStartingStage(info: GroupsThenSingleEliminationTourneyInfo): TourneyEliminationStageType {
    return info.nrOfGroups === 8
      ? TourneyEliminationStageType.last32
      : info.nrOfGroups >= 4
        ? TourneyEliminationStageType.quarterFinal
        : info.nrOfGroups >= 2
          ? TourneyEliminationStageType.semiFinal
          : TourneyEliminationStageType.final;
  }
}

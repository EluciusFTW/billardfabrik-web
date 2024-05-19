import { Tourney } from '../../models/tourney';
import { DoubleEliminationTourneyInfo } from '../../models/tourney-info';
import { TourneyEliminationStageType } from '../../models/tourney-single-elimination-stage-type';
import { SingleEliminationFunctions } from './single-elimination.functions';
import { DoubleEliminationStageFunctions } from './double-elimination-stage.functions';

export class DoubleEliminationFunctions {

  static create(info: DoubleEliminationTourneyInfo): Tourney {
    let doubleEliminationDownTo = TourneyEliminationStageType.numberOfPlayers(info.firstEliminationStage);

    return {
      doubleEliminationStages: DoubleEliminationStageFunctions.create(info, doubleEliminationDownTo),
      eliminationStages: SingleEliminationFunctions.createAllEmpty(info, info.firstEliminationStage)
    }
  }
}

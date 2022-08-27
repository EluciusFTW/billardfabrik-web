import { Injectable } from '@angular/core';
import { Match } from '../../models/match';
import { SingleEliminationEliminationStage } from '../../models/tourney-elimination-stage';
import { TourneyInfo } from '../../models/tourney-info';
import { TourneyPhaseStatus } from '../../models/tourney-phase-status';
import { TourneyEliminationStageType } from '../../models/tourney-single-elimination-stage-type';

@Injectable()
export class SingleEliminationCreationService {

  createAllEmpty(info: TourneyInfo, startingStage: TourneyEliminationStageType): SingleEliminationEliminationStage[] {
    return TourneyEliminationStageType
      .all()
      .filter(stageType => stageType <= startingStage)
      .map(stageType => ({
        eliminationType: "Single",
        type: stageType,
        title: TourneyEliminationStageType.map(stageType),
        players: [],
        matches: Array(TourneyEliminationStageType.numberOfMatches(stageType))
          .fill(false)
          .map(_ => Match.placeHolder(info.discipline, info.raceLength)),
        status: TourneyPhaseStatus.waitingForApproval
      }));
  }
}

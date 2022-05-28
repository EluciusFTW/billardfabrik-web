import { Injectable } from '@angular/core';
import { Match } from '../../models/match';
import { TourneyEliminationStage, TourneyEliminationStageType } from '../../models/tourney-elimination-stage';
import { TourneyInfo } from '../../models/tourney-info';
import { TourneyPhaseStatus } from '../../models/tourney-phase-status';

@Injectable()
export class SingleEliminationCreationService {

  createAllEmpty(info: TourneyInfo, startingStage: TourneyEliminationStageType): TourneyEliminationStage[] {
    return TourneyEliminationStageType
      .all()
      .filter(stageType => stageType <= startingStage)
      .map(stageType => ({
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

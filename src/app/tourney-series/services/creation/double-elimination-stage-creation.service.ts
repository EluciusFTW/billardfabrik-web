import { Injectable } from '@angular/core';
import { TourneyDoubleEliminationStage } from '../../models/tourney-double-elimination-stage';
import { TourneyInfo } from '../../models/tourney-info';

@Injectable()
export class DoubleEliminationStageCreationService {

  create(info: TourneyInfo, playersRemaining: number): TourneyDoubleEliminationStage[] {
    return [];
  }
}

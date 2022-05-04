import { Injectable } from '@angular/core';
import { TourneyDoubleEliminationStage, TourneyDoubleEliminationStageType } from '../../models/tourney-double-elimination-stage';
import { TourneyInfo } from '../../models/tourney-info';

@Injectable()
export class DoubleEliminationStageCreationService {

  create(info: TourneyInfo, playersRemaining: number): TourneyDoubleEliminationStage[] {

    let entryStage = TourneyDoubleEliminationStageType.startingStage(info.players.length);
    return [
      this.GetEntryStage(entryStage),
      ... this.GetWinnerStages(entryStage, playersRemaining),
      ... this.GetLooserStages(entryStage, playersRemaining)
    ]
  }

  GetEntryStage(entryStage: TourneyDoubleEliminationStageType): TourneyDoubleEliminationStage {
    throw new Error('Method not implemented.');
  }

  GetWinnerStages(entryStage: TourneyDoubleEliminationStageType, playersRemaining: number): TourneyDoubleEliminationStage[] {
    throw new Error('Method not implemented.');
  }

  GetLooserStages(entryStage: TourneyDoubleEliminationStageType, playersRemaining: number): TourneyDoubleEliminationStage[] {
    throw new Error('Method not implemented.');
  }
}

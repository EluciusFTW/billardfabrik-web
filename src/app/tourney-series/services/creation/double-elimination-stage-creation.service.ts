import { Injectable } from '@angular/core';
import { TourneyDoubleEliminationStage, TourneyDoubleEliminationStageType } from '../../models/tourney-double-elimination-stage';
import { DoubleEliminationTourneyInfo } from '../../models/tourney-info';
import { TourneyPhaseStatus } from '../../models/tourney-phase-status';
import { EliminationMatchesCreationService } from './elimination-matches-creation.service';

@Injectable()
export class DoubleEliminationStageCreationService {

  constructor(private eliminationCreationService: EliminationMatchesCreationService) {  }

  create(info: DoubleEliminationTourneyInfo, playersRemaining: number): TourneyDoubleEliminationStage[] {

    let entryStage = TourneyDoubleEliminationStageType.startingStage(info.players.length);
    return [
      this.getEntryStage(entryStage, info),
      // ... this.GetWinnerStages(entryStage, playersRemaining),
      // ... this.GetLooserStages(entryStage, playersRemaining)
    ]
  }

  getEntryStage(entryStage: TourneyDoubleEliminationStageType, info: DoubleEliminationTourneyInfo): TourneyDoubleEliminationStage {
    return {
      type: entryStage,
      players: info.players,
      matches: this.eliminationCreationService.getMatches(info.players, info.raceLength, info.discipline),
      status: TourneyPhaseStatus.waitingForApproval
    }
  }

  getWinnerStages(entryStage: TourneyDoubleEliminationStageType, playersRemaining: number): TourneyDoubleEliminationStage[] {
    throw new Error('Method not implemented.');
  }

  getLooserStages(entryStage: TourneyDoubleEliminationStageType, playersRemaining: number): TourneyDoubleEliminationStage[] {
    throw new Error('Method not implemented.');
  }
}

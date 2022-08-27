import { Injectable } from '@angular/core';
import { MatchPlayer } from '../../models/match-player';
import { TourneyDoubleEliminationStageType } from '../../models/tourney-double-elimination-stage-type';
import { DoubleEliminationEliminationStage } from '../../models/tourney-elimination-stage';
import { DoubleEliminationTourneyInfo } from '../../models/tourney-info';
import { TourneyPhaseStatus } from '../../models/tourney-phase-status';
import { EliminationMatchesCreationService } from './elimination-matches-creation.service';

@Injectable()
export class DoubleEliminationStageCreationService {

  constructor(private eliminationCreationService: EliminationMatchesCreationService) {  }

  create(info: DoubleEliminationTourneyInfo, playersRemaining: number): DoubleEliminationEliminationStage[] {

    let entryStage = TourneyDoubleEliminationStageType.startingStage(info.players.length);
    return [
      this.getEntryStage(entryStage, info),
      ... this.getWinnerStages(entryStage, info, playersRemaining),
      ... this.getLooserStages(entryStage, info, playersRemaining)
    ]
  }

  private getEntryStage(entryStage: TourneyDoubleEliminationStageType, info: DoubleEliminationTourneyInfo): DoubleEliminationEliminationStage {
    return {
      type: entryStage,
      eliminationType: "Double",
      title: TourneyDoubleEliminationStageType.map(entryStage),
      matches: this.eliminationCreationService.getMatchesFilledUpWithWalks(info.players, info.raceLength, info.discipline),
      status: TourneyPhaseStatus.waitingForApproval
    }
  }

  private getWinnerStages(entryStage: TourneyDoubleEliminationStageType, info: DoubleEliminationTourneyInfo, playersRemaining: number): DoubleEliminationEliminationStage[] {
    return this.fillStages(
      TourneyDoubleEliminationStageType
        .getWinnerStages()
        .filter(stage => stage > entryStage)
        .filter(stage => TourneyDoubleEliminationStageType.playersInStage(stage) >= playersRemaining),
      info);
  }

  private getLooserStages(entryStage: TourneyDoubleEliminationStageType, info: DoubleEliminationTourneyInfo, playersRemaining: number): DoubleEliminationEliminationStage[] {
    return this.fillStages(
      TourneyDoubleEliminationStageType
        .getLooserStages()
        .filter(stage => stage > entryStage)
        .filter(stage => TourneyDoubleEliminationStageType.playersInStage(stage) >= playersRemaining),
      info);
  }

  private fillStages(stages: TourneyDoubleEliminationStageType[], info: DoubleEliminationTourneyInfo) : DoubleEliminationEliminationStage[] {
    return stages
      .map(stage => ({
        stage,
        players: this.getUnknownPlayers(TourneyDoubleEliminationStageType.playersInStage(stage))
      }))
      .map(stageWithPlayers => ({
        type: stageWithPlayers.stage,
        eliminationType: "Double",
        title: TourneyDoubleEliminationStageType.map(stageWithPlayers.stage),
        matches: this.eliminationCreationService.getMatches(stageWithPlayers.players, info.raceLength, info.discipline),
        status: TourneyPhaseStatus.waitingForApproval
      }));
  }

  private getUnknownPlayers(numberOfPlayers: number): string[] {
    return Array(numberOfPlayers).fill(MatchPlayer.Unknown().name);
  }
}

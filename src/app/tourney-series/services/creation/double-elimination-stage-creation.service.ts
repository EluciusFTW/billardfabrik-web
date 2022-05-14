import { Injectable } from '@angular/core';
import { MatchPlayer } from '../../models/match-player';
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
      ... this.getWinnerStages(entryStage, info, 4),
      ... this.getLooserStages(entryStage, info, 4)
    ]
  }

  private getEntryStage(entryStage: TourneyDoubleEliminationStageType, info: DoubleEliminationTourneyInfo): TourneyDoubleEliminationStage {
    return {
      type: entryStage,
      players: info.players,
      matches: this.eliminationCreationService.getMatches(info.players, info.raceLength, info.discipline),
      status: TourneyPhaseStatus.waitingForApproval
    }
  }

  private getWinnerStages(entryStage: TourneyDoubleEliminationStageType, info: DoubleEliminationTourneyInfo, playersRemaining: number): TourneyDoubleEliminationStage[] {
    return TourneyDoubleEliminationStageType
      .getWinnerStages()
      .filter(stage => stage > entryStage)
      .filter(stage => TourneyDoubleEliminationStageType.playersInStage(stage) >= playersRemaining)
      .map(stage => ({stage, players: this.getUnknownPlayers(TourneyDoubleEliminationStageType.playersInStage(stage))}))
      .map(stageWithPlayers => ({
        type: stageWithPlayers.stage,
        players: stageWithPlayers.players,
        matches: this.eliminationCreationService.getMatches(stageWithPlayers.players, info.raceLength, info.discipline),
        status: TourneyPhaseStatus.waitingForApproval
      }))
  }

  private getUnknownPlayers(nr: number): string[] {
    let name = MatchPlayer.Unknown().name;
    return Array(nr).fill(name);
  }

  private getLooserStages(entryStage: TourneyDoubleEliminationStageType, info: DoubleEliminationTourneyInfo, playersRemaining: number): TourneyDoubleEliminationStage[] {
    return TourneyDoubleEliminationStageType
      .getLooserStages()
      .filter(stage => stage > entryStage)
      .filter(stage => TourneyDoubleEliminationStageType.playersInStage(stage) >= playersRemaining)
      .map(stage => ({stage, players: this.getUnknownPlayers(TourneyDoubleEliminationStageType.playersInStage(stage))}))
      .map(stageWithPlayers => ({
        type: stageWithPlayers.stage,
        players: stageWithPlayers.players,
        matches: this.eliminationCreationService.getMatches(stageWithPlayers.players, info.raceLength, info.discipline),
        status: TourneyPhaseStatus.waitingForApproval
      }))
  }
}

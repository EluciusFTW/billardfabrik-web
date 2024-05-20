import { MatchPlayer } from '../models/match-player';
import { TourneyDoubleEliminationStageType } from '../models/tourney-double-elimination-stage-type';
import { DoubleEliminationEliminationStage } from '../models/tourney-elimination-stage';
import { DoubleEliminationTourneyInfo } from '../models/tourney-info';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { EliminationMatchesFunctions as EliminationMatchesFunctions } from './elimination-matches.functions';

export class DoubleEliminationStageFunctions {

  static create(info: DoubleEliminationTourneyInfo, playersRemaining: number): DoubleEliminationEliminationStage[] {

    let entryStage = TourneyDoubleEliminationStageType.startingStage(info.players.length);
    return [
      this.getEntryStage(entryStage, info),
      ... this.getWinnerStages(entryStage, info, playersRemaining),
      ... this.getLoserStages(entryStage, info, playersRemaining)
    ]
  }

  private static getEntryStage(entryStage: TourneyDoubleEliminationStageType, info: DoubleEliminationTourneyInfo): DoubleEliminationEliminationStage {
    return {
      type: entryStage,
      eliminationType: "Double",
      title: TourneyDoubleEliminationStageType.map(entryStage),
      matches: EliminationMatchesFunctions.getMatchesFilledUpWithWalks(info.players, info.raceLength, info.discipline),
      status: TourneyPhaseStatus.waitingForApproval
    }
  }

  private static getWinnerStages(entryStage: TourneyDoubleEliminationStageType, info: DoubleEliminationTourneyInfo, playersRemaining: number): DoubleEliminationEliminationStage[] {
    return this.fillStages(
      TourneyDoubleEliminationStageType
        .getWinnerStages()
        .filter(stage => stage > entryStage)
        .filter(stage => TourneyDoubleEliminationStageType.playersInStage(stage) >= playersRemaining),
      info);
  }

  private static getLoserStages(entryStage: TourneyDoubleEliminationStageType, info: DoubleEliminationTourneyInfo, playersRemaining: number): DoubleEliminationEliminationStage[] {
    return this.fillStages(
      TourneyDoubleEliminationStageType
        .getLoserStages()
        .filter(stage => stage > entryStage)
        .filter(stage => TourneyDoubleEliminationStageType.playersInStage(stage) >= playersRemaining),
      info);
  }

  private static fillStages(stages: TourneyDoubleEliminationStageType[], info: DoubleEliminationTourneyInfo) : DoubleEliminationEliminationStage[] {
    return stages
      .map(stage => ({
        stage,
        players: this.getUnknownPlayers(TourneyDoubleEliminationStageType.playersInStage(stage))
      }))
      .map(stageWithPlayers => ({
        type: stageWithPlayers.stage,
        eliminationType: "Double",
        title: TourneyDoubleEliminationStageType.map(stageWithPlayers.stage),
        matches: EliminationMatchesFunctions.getMatches(stageWithPlayers.players, info.raceLength, info.discipline),
        status: TourneyPhaseStatus.waitingForApproval
      }));
  }

  private static getUnknownPlayers(numberOfPlayers: number): string[] {
    return Array(numberOfPlayers).fill(MatchPlayer.Unknown().name);
  }
}

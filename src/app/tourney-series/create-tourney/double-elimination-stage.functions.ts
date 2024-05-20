import { MatchPlayer } from '../models/match-player';
import { TourneyDoubleEliminationStageType } from '../models/tourney-double-elimination-stage-type';
import { DoubleEliminationEliminationStage } from '../models/tourney-elimination-stage';
import { DoubleEliminationTourneyInfo } from '../models/tourney-info';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { getMatches, getMatchesFilledUpWithWalks } from './elimination-matches.functions';

export function createDoubleEliminationStages(info: DoubleEliminationTourneyInfo, playersRemaining: number): DoubleEliminationEliminationStage[] {
  const entryStage = TourneyDoubleEliminationStageType.startingStage(info.players.length);
  return [
    getEntryStage(entryStage, info),
    ...getWinnerStages(entryStage, info, playersRemaining),
    ...getLoserStages(entryStage, info, playersRemaining)
  ]
}

function getEntryStage(entryStage: TourneyDoubleEliminationStageType, info: DoubleEliminationTourneyInfo): DoubleEliminationEliminationStage {
  return {
    type: entryStage,
    eliminationType: "Double",
    title: TourneyDoubleEliminationStageType.map(entryStage),
    matches: getMatchesFilledUpWithWalks(info.players, info.raceLength, info.discipline),
    status: TourneyPhaseStatus.waitingForApproval
  }
}

function getWinnerStages(entryStage: TourneyDoubleEliminationStageType, info: DoubleEliminationTourneyInfo, playersRemaining: number): DoubleEliminationEliminationStage[] {
  return fillStages(
    TourneyDoubleEliminationStageType
      .getWinnerStages()
      .filter(stage => stage > entryStage)
      .filter(stage => TourneyDoubleEliminationStageType.playersInStage(stage) >= playersRemaining),
    info);
}

function getLoserStages(entryStage: TourneyDoubleEliminationStageType, info: DoubleEliminationTourneyInfo, playersRemaining: number): DoubleEliminationEliminationStage[] {
  return fillStages(
    TourneyDoubleEliminationStageType
      .getLoserStages()
      .filter(stage => stage > entryStage)
      .filter(stage => TourneyDoubleEliminationStageType.playersInStage(stage) >= playersRemaining),
    info);
}

function fillStages(stages: TourneyDoubleEliminationStageType[], info: DoubleEliminationTourneyInfo): DoubleEliminationEliminationStage[] {
  return stages
    .map(stage => ({
      stage,
      players: getUnknownPlayers(TourneyDoubleEliminationStageType.playersInStage(stage))
    }))
    .map(stageWithPlayers => ({
      type: stageWithPlayers.stage,
      eliminationType: "Double",
      title: TourneyDoubleEliminationStageType.map(stageWithPlayers.stage),
      matches: getMatches(stageWithPlayers.players, info.raceLength, info.discipline),
      status: TourneyPhaseStatus.waitingForApproval
    }));
}

function getUnknownPlayers(numberOfPlayers: number): string[] {
  return Array(numberOfPlayers).fill(MatchPlayer.Unknown().name);
}

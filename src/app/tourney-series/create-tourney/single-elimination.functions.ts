import { Match } from '../models/match';
import { SingleEliminationEliminationStage } from '../models/tourney-elimination-stage';
import { TourneyInfo } from '../models/tourney-info';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';
import { MatchPlayer } from '../models/match-player';
import { reOrderRandomly } from 'src/app/shared/utility.functions';

export function createSingleEliminationStages(info: TourneyInfo): SingleEliminationEliminationStage[] {
  return getStages(TourneyEliminationStageType.startingStage(info.players.length))
    .map((stageType, index) => ({
      eliminationType: 'Single',
      type: stageType,
      title: TourneyEliminationStageType.map(stageType),
      matches: index === 0
        ? getMatches(stageType, info)
        : getPlaceholderMatches(stageType, info),
      status: TourneyPhaseStatus.waitingForApproval
    }));
}

export function createEmptySingleEliminationStages(info: TourneyInfo, startingStage: TourneyEliminationStageType): SingleEliminationEliminationStage[] {
  return getStages(startingStage)
    .map(stageType => ({
      eliminationType: 'Single',
      type: stageType,
      title: TourneyEliminationStageType.map(stageType),
      players: [],
      matches: getPlaceholderMatches(stageType, info),
      status: TourneyPhaseStatus.waitingForApproval
    }));
}

function getMatches(stageType: TourneyEliminationStageType, info: TourneyInfo): Match[] {
  const players = getPlayers(stageType, info);
  return getSeededPairs(players)
    .map(pair => Match.create(pair[0], pair[1], info.discipline, info.raceLength));
}

function getPlayers(stageType: TourneyEliminationStageType, info: TourneyInfo): MatchPlayer[] {
  const players = info.players.map(p => MatchPlayer.From(p));
  return [
    ... (info.seeded
      ? players
      : reOrderRandomly(players)),
    ... Array(TourneyEliminationStageType.numberOfPlayers(stageType) - info.players.length)
      .fill(MatchPlayer.Walk())
  ];
}

function getSeededPairs(players: MatchPlayer[]) {
  const playerCopy = [...players];
  const seededPlayers = playerCopy.splice(0, playerCopy.length / 2);
  const remainingReordered = reOrderRandomly(playerCopy);

  return seededPlayers.map((seededPlayer, index) => [seededPlayer, remainingReordered[index]]);
}

function getStages(startingStage: TourneyEliminationStageType): TourneyEliminationStageType[] {
  return startingStage === TourneyEliminationStageType.final
    ? [TourneyEliminationStageType.thirdPlace, TourneyEliminationStageType.final]
    : TourneyEliminationStageType
      .all()
      .filter(stageType => stageType <= startingStage);
}

function getPlaceholderMatches(stageType: TourneyEliminationStageType, info: TourneyInfo): Match[] {
  return Array(TourneyEliminationStageType.numberOfMatches(stageType))
    .fill(Match.placeHolder(info.discipline, info.raceLength));
}

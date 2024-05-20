import { Match } from '../models/match';
import { SingleEliminationEliminationStage } from '../models/tourney-elimination-stage';
import { TourneyInfo } from '../models/tourney-info';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';
import { MatchPlayer } from '../models/match-player';
import { chunk, reOrderRandomly } from 'src/app/shared/utility.functions';

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
  const matchPlayers = [
    ...info.players.map(p => MatchPlayer.From(p)),
    ...missingPlayers(stageType, info.players.length)
  ];

  const playerPairs = info.seeded
    ? getSeededPairs(matchPlayers)
    : getRandomPairs(matchPlayers);

  return playerPairs.map(pair => Match.create(pair[0], pair[1], info.discipline, info.raceLength));
}

function missingPlayers(stageType: TourneyEliminationStageType, nrOfPlayers: number): MatchPlayer[] {
  return Array(TourneyEliminationStageType.numberOfPlayers(stageType) - nrOfPlayers)
    .fill(MatchPlayer.Walk())
}

function getRandomPairs(players: MatchPlayer[]): MatchPlayer[][] {
  const playerCopy = [...players];
  return chunk(reOrderRandomly(playerCopy), 2);
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
    .fill(false)
    .map(_ => Match.placeHolder(info.discipline, info.raceLength));
}

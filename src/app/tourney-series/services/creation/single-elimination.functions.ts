import { Match } from '../../models/match';
import { SingleEliminationEliminationStage } from '../../models/tourney-elimination-stage';
import { TourneyInfo } from '../../models/tourney-info';
import { TourneyPhaseStatus } from '../../models/tourney-phase-status';
import { TourneyEliminationStageType } from '../../models/tourney-single-elimination-stage-type';
import { MatchPlayer } from '../../models/match-player';
import { CreationFunctions } from './creation.functions';

export class SingleEliminationFunctions {

  static create(info: TourneyInfo): SingleEliminationEliminationStage[] {
    return this
      .getStages(TourneyEliminationStageType.startingStage(info.players.length))
      .map((stageType, index) => ({
        eliminationType: 'Single',
        type: stageType,
        title: TourneyEliminationStageType.map(stageType),
        matches: index === 0
          ? this.getMatches(stageType, info)
          : this.getPlaceholderMatches(stageType, info),
        status: TourneyPhaseStatus.waitingForApproval
      }));
  }

  static createAllEmpty(info: TourneyInfo, startingStage: TourneyEliminationStageType): SingleEliminationEliminationStage[] {
    return this
      .getStages(startingStage)
      .map(stageType => ({
        eliminationType: 'Single',
        type: stageType,
        title: TourneyEliminationStageType.map(stageType),
        players: [],
        matches: this.getPlaceholderMatches(stageType, info),
        status: TourneyPhaseStatus.waitingForApproval
      }));
  }

  private static getMatches(stageType: TourneyEliminationStageType, info: TourneyInfo): Match[] {
    const matchPlayers = [
      ... info.players.map(p => MatchPlayer.From(p)),
      ... this.missingPlayers(stageType, info.players.length)
    ];

    const playerPairs = info.seeded
      ? this.getSeededPairs(matchPlayers)
      : this.getRandomPairs(matchPlayers);

    return playerPairs.map(pair => Match.create(pair[0], pair[1], info.discipline, info.raceLength));
  }

  private static missingPlayers(stageType: TourneyEliminationStageType, nrOfPlayers: number): MatchPlayer[] {
    return Array(TourneyEliminationStageType.numberOfPlayers(stageType) - nrOfPlayers)
      .fill(MatchPlayer.Walk())
  }

  private static getRandomPairs(players: MatchPlayer[]): MatchPlayer[][] {
    const playerCopy = [ ... players];
    return CreationFunctions.chunk(CreationFunctions.reOrderRandomly(playerCopy), 2);
  }

  private static getSeededPairs(players: MatchPlayer[]) {
    const playerCopy = [ ... players];
    const seededPlayers = playerCopy.splice(0, playerCopy.length / 2);
    const remainingReordered = CreationFunctions.reOrderRandomly(playerCopy);

    return seededPlayers.map((seededPlayer, index) => [seededPlayer, remainingReordered[index]]);
  }

  private static getStages(startingStage: TourneyEliminationStageType): TourneyEliminationStageType[] {
    return startingStage === TourneyEliminationStageType.final
      ? [TourneyEliminationStageType.thirdPlace, TourneyEliminationStageType.final]
      : TourneyEliminationStageType
        .all()
        .filter(stageType => stageType <= startingStage);
  }

  private static getPlaceholderMatches(stageType: TourneyEliminationStageType, info: TourneyInfo): Match[] {
    return Array(TourneyEliminationStageType.numberOfMatches(stageType))
      .fill(false)
      .map(_ => Match.placeHolder(info.discipline, info.raceLength));
  }
}

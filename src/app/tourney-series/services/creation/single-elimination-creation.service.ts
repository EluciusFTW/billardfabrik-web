import { Injectable } from '@angular/core';
import { Match } from '../../models/match';
import { SingleEliminationEliminationStage } from '../../models/tourney-elimination-stage';
import { TourneyInfo } from '../../models/tourney-info';
import { TourneyPhaseStatus } from '../../models/tourney-phase-status';
import { TourneyEliminationStageType } from '../../models/tourney-single-elimination-stage-type';
import { MatchPlayer } from '../../models/match-player';

@Injectable()
export class SingleEliminationCreationService {

  create(info: TourneyInfo): SingleEliminationEliminationStage[] {
    return this
      .getStages(TourneyEliminationStageType.startingStage(info.players.length))
      .map((stageType, index) => ({
        eliminationType: 'Single' as const,
        type: stageType,
        title: TourneyEliminationStageType.map(stageType),
        matches: index === 0
          ? this.getMatches(stageType, info)
          : this.getPlaceholderMatches(stageType, info),
        status: TourneyPhaseStatus.waitingForApproval
      }));
  }

  private getMatches(stageType: TourneyEliminationStageType, info: TourneyInfo): Match[] {
    const matchPlayers = [
      ... info.players.map(p => MatchPlayer.From(p)),
      ... this.missingPlayers(stageType, info.players.length)
    ];

    const playerPairs = info.seeded
      ? this.getSeededPairs(matchPlayers)
      : this.getRandomPairs(matchPlayers);

    return playerPairs.map(pair => Match.create(pair[0], pair[1], info.discipline, info.raceLength));
  }

  private missingPlayers(stageType: TourneyEliminationStageType, nrOfPlayers: number): MatchPlayer[] {
    return Array(TourneyEliminationStageType.numberOfPlayers(stageType) - nrOfPlayers)
      .fill(MatchPlayer.Walk())
  }

  private getRandomPairs(players: MatchPlayer[]): MatchPlayer[][] {
    const playerCopy = [ ... players];
    return this.chunk(this.reOrderRandomly(playerCopy), 2);
  }

  private getSeededPairs(players: MatchPlayer[]) {
    const playerCopy = [ ... players];
    const seededPlayers = playerCopy.splice(0, playerCopy.length / 2);
    const remainingReordered = this.reOrderRandomly(playerCopy);

    return seededPlayers.map((seededPlayer, index) => [seededPlayer, remainingReordered[index]]);
  }

  private reOrderRandomly(players: MatchPlayer[]): MatchPlayer[] {
    let randomOrderedPlayers: MatchPlayer[] = [];
    while (players.length > 0) {
      let randomIndex = Math.floor(Math.random() * players.length);
      randomOrderedPlayers.push(players[randomIndex]);
      players.splice(randomIndex, 1);
    }
    return randomOrderedPlayers;
  }

  private chunk(array: any[], size: number): any[][] {
    let result: any[][] = [];
    while (array.length > 0) {
      result.push(array.splice(0, size));
    }
    return result;
  }


  createAllEmpty(info: TourneyInfo, startingStage: TourneyEliminationStageType): SingleEliminationEliminationStage[] {
    return this
      .getStages(startingStage)
      .map(stageType => ({
        eliminationType: "Single",
        type: stageType,
        title: TourneyEliminationStageType.map(stageType),
        players: [],
        matches: this.getPlaceholderMatches(stageType, info),
        status: TourneyPhaseStatus.waitingForApproval
      }));
  }

  private getPlaceholderMatches(stageType: TourneyEliminationStageType, info: TourneyInfo): Match[] {
    return Array(TourneyEliminationStageType.numberOfMatches(stageType))
      .fill(false)
      .map(_ => Match.placeHolder(info.discipline, info.raceLength));
  }

  private getStages(startingStage: TourneyEliminationStageType): TourneyEliminationStageType[] {
    return startingStage === TourneyEliminationStageType.final
      ? [TourneyEliminationStageType.thirdPlace, TourneyEliminationStageType.final]
      : TourneyEliminationStageType
        .all()
        .filter(stageType => stageType <= startingStage);
  }
}

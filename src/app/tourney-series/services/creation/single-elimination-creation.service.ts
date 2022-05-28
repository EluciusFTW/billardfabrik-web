import { Injectable } from '@angular/core';
import { Match } from '../../models/match';
import { MatchPlayer } from '../../models/match-player';
import { MatchStatus } from '../../models/match-status';
import { TourneyEliminationStage, TourneyEliminationStageType } from '../../models/tourney-elimination-stage';
import { TourneyInfo } from '../../models/tourney-info';
import { TourneyPhaseStatus } from '../../models/tourney-phase-status';

@Injectable()
export class SingleEliminationCreationService {

  createAllEmpty(info: TourneyInfo, startingStage: TourneyEliminationStageType): TourneyEliminationStage[] {
    return TourneyEliminationStageType
      .all()
      .filter(stageType => stageType <= startingStage)
      .map(stageType => ({
        type: stageType,
        title: TourneyEliminationStageType.map(stageType),
        players: [],
        matches: this.buildEliminationMatches(TourneyEliminationStageType.numberOfMatches(stageType), info),
        status: TourneyPhaseStatus.waitingForApproval
      }));
  }

  private buildEliminationMatches(nrOfMatches: number, info: TourneyInfo): Match[] {
    const matchPlaceHolder = {
      playerOne: MatchPlayer.Unknown(),
      playerTwo: MatchPlayer.Unknown(),
      discipline: info.discipline,
      length: info.raceLength,
      status: MatchStatus.notStarted
    }
    return Array(nrOfMatches).fill(matchPlaceHolder);
  }
}

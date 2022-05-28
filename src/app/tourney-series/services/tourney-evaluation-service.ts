import { Injectable } from '@angular/core';
import { Match } from '../models/match';
import { MatchStatus } from '../models/match-status';
import { Tourney } from '../models/tourney';
import { TourneyEliminationStageType } from '../models/tourney-elimination-stage';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';


@Injectable()
export class TourneyEvaluationService {

  public GetPlayerCount(tourney: Tourney): number {
    return tourney.groups
      .map(group => group.players)
      .reduce((acc, curr) => acc + curr.length, 0);
  }

  public GetWinner(tourney: Tourney): string {
    const finalStage = tourney.eliminationStages.filter(stage => stage.type === TourneyEliminationStageType.final)[0];

    return finalStage.status === TourneyPhaseStatus.finalized
      ? finalStage.matches[0].winner().name
      : ''
  }

  public GetSecondPlace(tourney: Tourney): string {
    const finalStage = tourney.eliminationStages.filter(stage => stage.type === TourneyEliminationStageType.final)[0];

    return finalStage.status === TourneyPhaseStatus.finalized
      ? finalStage.matches[0].looser().name
      : ''
  }

  public GetThirdPlace(tourney: Tourney): string {
    const thirdPlaceStage = tourney.eliminationStages.filter(stage => stage.type === TourneyEliminationStageType.thirdPlace)[0];
    const thirdPlaceMatch = thirdPlaceStage.matches[0];

    if (thirdPlaceStage.status !== TourneyPhaseStatus.finalized) {
      return ''
    }
    if (thirdPlaceMatch.status === MatchStatus.cancelled) {
      return '** nicht ausgespielt **';
    }

    return thirdPlaceMatch.winner().name;
  }
}

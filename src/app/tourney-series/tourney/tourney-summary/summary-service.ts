import { Injectable } from '@angular/core';
import { Match } from '../../models/match';
import { MatchStatus } from '../../models/match-status';
import { Tourney } from '../../models/tourney';
import { TourneyPhaseStatus } from '../../models/tourney-phase-status';
import { TourneyEliminationStageType } from '../../models/tourney-single-elimination-stage-type';

@Injectable()
export class SummaryService {

  public GetPlayerCount(tourney: Tourney): number {
    return tourney.meta?.numberOfPlayers
      ?? tourney.groups?.flatMap(group => group.players).length
      ?? 0;
  }

  public GetWinner(tourney: Tourney): string {
    const finalStage = tourney.eliminationStages.filter(stage => stage.type === TourneyEliminationStageType.final)[0];

    return finalStage.status === TourneyPhaseStatus.finalized
      ? Match.winner(finalStage.matches[0]).name
      : ''
  }

  public GetSecondPlace(tourney: Tourney): string {
    const finalStage = tourney.eliminationStages.filter(stage => stage.type === TourneyEliminationStageType.final)[0];

    return finalStage.status === TourneyPhaseStatus.finalized
      ? Match.loser(finalStage.matches[0]).name
      : ''
  }

  public GetThirdPlace(tourney: Tourney): string {
    const thirdPlaceStage = tourney.eliminationStages.filter(stage => stage.type === TourneyEliminationStageType.thirdPlace)[0];

    if (thirdPlaceStage?.status !== TourneyPhaseStatus.finalized) {
      return ''
    }

    const thirdPlaceMatch = thirdPlaceStage.matches[0];
    if (thirdPlaceMatch.status === MatchStatus.cancelled) {
      return '** nicht ausgespielt **';
    }

    return Match.winner(thirdPlaceMatch).name;
  }
}

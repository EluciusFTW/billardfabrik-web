import { Injectable } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyEvaluation } from '../../models/evaluation/tourney-evaluation';
import { TourneyStatus } from '../../models/tourney-status';
import { getMatchRecords } from './tourney-matches.functions';
import { getPlacements } from './placements/placement.functions';

@Injectable()
export class TourneyStatisticsService {

  public Evaluate(tourney: Tourney): TourneyEvaluation {
    if (tourney.meta.status < TourneyStatus.completed) {
      return {
        mode: tourney.meta.modus,
        players: [],
      };
    }

    const matchesByPlayer = getMatchRecords(tourney);
    const placementsByPlayer = getPlacements(tourney);

    return {
      mode: tourney.meta.modus,
      players: [...matchesByPlayer.keys()]
        .map(player => ({
          name: player,
          matches: matchesByPlayer.get(player),
          placement: placementsByPlayer.get(player)
        }))
    }
  }
}

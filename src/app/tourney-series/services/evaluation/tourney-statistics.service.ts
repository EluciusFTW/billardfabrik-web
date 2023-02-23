import { Injectable } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyEvaluation } from '../../models/evaluation/tourney-evaluation';
import { TourneyStatus } from '../../models/tourney-status';
import { TourneyPlacementsService } from './tourney-placements.service';
import { TourneyMatchesService } from './tourney-matches.service';

@Injectable()
export class TourneyStatisticsService {

  constructor(private placementsService: TourneyPlacementsService, private matchesService: TourneyMatchesService) { }

  public Evaluate(tourney: Tourney): TourneyEvaluation {
    if (tourney.meta.status !== TourneyStatus.completed) {
      console.log('Tourney is still in status: ', tourney.meta.status);
      return { players: [] };
    }

    const matchesByPlayer = this.matchesService.Evaluate(tourney);
    const placementsByPlayer = this.placementsService.Evaluate(tourney);

    return {
      players: [...matchesByPlayer.keys()]
        .map(player => ({
          name: player,
          matches: matchesByPlayer.get(player),
          placement: placementsByPlayer.get(player)
        }))
    }
  }
}

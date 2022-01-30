import { Injectable } from '@angular/core';
import { Match, MatchType } from '../models/match';
import { MatchPlayer } from '../models/match-player';
import { MatchStatus } from '../models/match-status';
import { Tourney } from '../models/tourney';
import { TourneyEliminationStage, TourneyEliminationStageType } from '../models/Tourney-elimination-stage';
import { PlacementRecord, PlayerMatchRecord, TourneyEvaluation, TourneyPlacementType } from '../models/tourney-evaluation';
import { TourneyGroup } from '../models/tourney-group';
import { TourneyMeta } from '../models/tourney-meta';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { TourneyStatus } from '../models/tourney-status';
import { TourneyPointsService } from './tourney-points.service';

@Injectable()
export class TourneyStatisticsService {

  constructor(private pointsService: TourneyPointsService) { }

  public Evaluate(tourney: Tourney): TourneyEvaluation {
    if (tourney.meta.status !== TourneyStatus.completed) {
      return;
    }

    const matchesByPlayer = this.GetMachesByPlayer(tourney);
    const placementsByPlayer = this.GetPlacementsByPlayer(tourney);

    return {
      players: [...matchesByPlayer.keys()]
        .map(player => ({
          name: player,
          matches: matchesByPlayer.get(player),
          placement: placementsByPlayer.get(player)
        })),
    }
  }

  private GetPlacementsByPlayer(tourney: Tourney): Map<string, PlacementRecord> {
    const result = new Map<string, PlacementRecord>();

    tourney.groups
      .forEach(group => group.players
        .filter(player => !group.qualified.includes(player))
        .forEach(eliminated => result.set(eliminated, this.BuildPlacementRecord(tourney, TourneyPlacementType.GroupStage))));

    tourney.eliminationStages
      .filter(stage => stage.status === TourneyPhaseStatus.finalized)
      .forEach(stage => {
        stage.matches
          .filter(match => match.status === MatchStatus.done || match.status === MatchStatus.cancelled)
          .forEach(match => {
            const looserPlacement = this.MapStageLooserToPlacement(stage.type);
            const looserRecord = this.BuildPlacementRecord(tourney, looserPlacement);
            const loosers = match.status === MatchStatus.done
              ? match.playerOne.points === match.length
                ? [match.playerTwo.name]
                : [match.playerOne.name]
              : [match.playerOne.name, match.playerTwo.name];
            loosers.forEach(looser => result.set(looser, looserRecord));

            if (match.status === MatchStatus.done
              && (stage.type === TourneyEliminationStageType.thirdPlace || TourneyEliminationStageType.final)) {
              const winner = match.playerOne.points === match.length
                ? match.playerOne.name
                : match.playerTwo.name;

              const winnerPlacement = this.MapStageWinnerToPlacement(stage.type);
              result.set(winner, this.BuildPlacementRecord(tourney, winnerPlacement));
            }
          })
      })
    return result;
  }

  private BuildPlacementRecord(tourney: Tourney, placement: TourneyPlacementType): PlacementRecord {
    return {
      discipline: tourney.meta.discipline,
      placement: placement,
      tourney: this.ToTourneyName(tourney.meta),
      points: this.pointsService.calculate(tourney, placement)
    }
  }

  private MapStageWinnerToPlacement(type: TourneyEliminationStageType) {
    switch (type) {
      case TourneyEliminationStageType.thirdPlace: return TourneyPlacementType.ThirdPlace;
      case TourneyEliminationStageType.final: return TourneyPlacementType.Winner;
    }
  }

  private MapStageLooserToPlacement(type: TourneyEliminationStageType): TourneyPlacementType {
    switch (type) {
      case TourneyEliminationStageType.eigthFinal: return TourneyPlacementType.EigthFinal;
      case TourneyEliminationStageType.quarterFinal: return TourneyPlacementType.QuarterFinal;
      case TourneyEliminationStageType.thirdPlace: return TourneyPlacementType.FourthPlace;
      case TourneyEliminationStageType.final: return TourneyPlacementType.RunnerUp;
    }
  }

  private GetMachesByPlayer(tourney: Tourney): Map<string, PlayerMatchRecord[]> {
    const groupMatches = tourney.groups.map(group => this.GetMatchesFromGroup(tourney.meta, group));
    const stageMatches = tourney.eliminationStages.map(stage => this.GetMatchesFromStage(tourney.meta, stage))

    return groupMatches
      .concat(stageMatches)
      .reduce((pv, cv) => {
        for (const [key, value] of cv.entries()) {
          pv.set(key, (pv.get(key) || []).concat(value));
        }
        return pv;
      });
  }

  private GetMatchesFromGroup(meta: TourneyMeta, group: TourneyGroup): Map<string, PlayerMatchRecord[]> {
    const res: { [name: string]: PlayerMatchRecord[]; } = {};
    group.players.forEach(p => res[p] = [])
    group.matches
      .filter(match => match.status === MatchStatus.done)
      .forEach(match => {
        res[match.playerOne.name].push(this.ToPlayerMatch(meta, MatchType.Group, match, match.playerOne, match.playerTwo));
        res[match.playerTwo.name].push(this.ToPlayerMatch(meta, MatchType.Group, match, match.playerTwo, match.playerOne));
      });

    const resMap = new Map<string, PlayerMatchRecord[]>();
    for (const [key, value] of Object.entries(res)) {
      resMap.set(key, value)
    }
    return resMap;
  }

  private GetMatchesFromStage(meta: TourneyMeta, stage: TourneyEliminationStage): Map<string, PlayerMatchRecord[]> {
    const res: { [name: string]: PlayerMatchRecord; } = {};
    stage.matches
      .filter(match => match.status === MatchStatus.done)
      .forEach(match => {
        res[match.playerOne.name] = this.ToPlayerMatch(meta, MatchType.Elimination, match, match.playerOne, match.playerTwo);
        res[match.playerTwo.name] = this.ToPlayerMatch(meta, MatchType.Elimination, match, match.playerTwo, match.playerOne);
      });

    const resMap = new Map<string, PlayerMatchRecord[]>();
    for (const [key, value] of Object.entries(res)) {
      resMap.set(key, [value])
    }
    return resMap;
  }

  private ToPlayerMatch(meta: TourneyMeta, type: MatchType, match: Match, self: MatchPlayer, opponent: MatchPlayer): PlayerMatchRecord {
    return {
      opponent: opponent.name,
      oppScore: opponent.points,
      myScore: self.points,
      discipline: match.discipline,
      when: new Date().valueOf(),
      type: type,
      tourney: this.ToTourneyName(meta)
    }
  }

  private ToTourneyName(meta: TourneyMeta): string {
    return meta.name + '-' + meta.date;
  }
}

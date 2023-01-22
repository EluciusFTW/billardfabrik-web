import { Injectable } from '@angular/core';
import { Match } from '../models/match';
import { MatchType } from '../models/match-type';
import { MatchPlayer } from '../models/match-player';
import { MatchStatus } from '../models/match-status';
import { Tourney } from '../models/tourney';
import { TourneyEliminationStage } from '../models/tourney-elimination-stage';
import { TourneyEvaluation } from '../models/evaluation/tourney-evaluation';
import { PlacementRecord } from '../models/evaluation/placement-record';
import { PlayerMatchRecord } from '../models/evaluation/player-match-record';
import { TourneyPlacementType } from '../models/evaluation/tourney-placement-type';
import { TourneyGroup } from '../models/tourney-group';
import { TourneyMeta } from '../models/tourney-meta';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { TourneyStatus } from '../models/tourney-status';
import { TourneyPointsService } from './tourney-points.service';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';

@Injectable()
export class TourneyStatisticsService {

  relevantStagesForTourneyRecords = [
    TourneyEliminationStageType.final,
    TourneyEliminationStageType.thirdPlace,
    TourneyEliminationStageType.quarterFinal,
    TourneyEliminationStageType.last16
  ];

  constructor(private pointsService: TourneyPointsService) { }

  public Evaluate(tourney: Tourney): TourneyEvaluation {
    if (tourney.meta.status !== TourneyStatus.completed) {
      return { players: [] };
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
      .filter(stage => this.relevantStagesForTourneyRecords.find(i => i === stage.type) + 1)
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
              && (stage.type === TourneyEliminationStageType.thirdPlace || stage.type === TourneyEliminationStageType.final)) {
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
      default: throw Error;
    }
  }

  private MapStageLooserToPlacement(type: TourneyEliminationStageType): TourneyPlacementType {
    switch (type) {
      case TourneyEliminationStageType.last16: return TourneyPlacementType.EigthFinal;
      case TourneyEliminationStageType.quarterFinal: return TourneyPlacementType.QuarterFinal;
      case TourneyEliminationStageType.thirdPlace: return TourneyPlacementType.FourthPlace;
      case TourneyEliminationStageType.final: return TourneyPlacementType.RunnerUp;
      default: throw new Error("The stage type cannot be mapped to a placement type.")
    }
  }

  private GetMachesByPlayer(tourney: Tourney): Map<string, PlayerMatchRecord[]> {
    const groupMatches = tourney.groups.map(group => this.GetMatchesFromGroup(tourney.meta, group));
    const stageMatches = tourney.eliminationStages.map(stage => this.GetMatchesFromStage(tourney.meta, stage))

    return this.ReduceMaps(groupMatches.concat(stageMatches));
  }

  private GetMatchesFromGroup(meta: TourneyMeta, group: TourneyGroup): Map<string, PlayerMatchRecord[]> {
    const records: { [name: string]: PlayerMatchRecord[]; } = {};
    group.players.forEach(player => records[player] = [])
    group.matches
      .filter(match => match.status === MatchStatus.done)
      .forEach(match => {
        records[match.playerOne.name].push(this.ToPlayerMatch(meta, MatchType.Group, match, match.playerOne, match.playerTwo));
        records[match.playerTwo.name].push(this.ToPlayerMatch(meta, MatchType.Group, match, match.playerTwo, match.playerOne));
      });

    return this.ToMap(records)
  }

  private GetMatchesFromStage(meta: TourneyMeta, stage: TourneyEliminationStage): Map<string, PlayerMatchRecord[]> {
    const records: { [name: string]: PlayerMatchRecord[]; } = {};
    stage.matches
      .filter(match => match.status === MatchStatus.done)
      .forEach(match => {
        records[match.playerOne.name] = [this.ToPlayerMatch(meta, MatchType.Elimination, match, match.playerOne, match.playerTwo)];
        records[match.playerTwo.name] = [this.ToPlayerMatch(meta, MatchType.Elimination, match, match.playerTwo, match.playerOne)];
      });

    return this.ToMap(records);
  }

  private ToMap(data: { [name: string]: PlayerMatchRecord[]; }): Map<string, PlayerMatchRecord[]> {
    const resMap = new Map<string, PlayerMatchRecord[]>();
    for (const [key, value] of Object.entries(data)) {
      resMap.set(key, value)
    }
    return resMap;
  }

  private ReduceMaps(maps: Map<string, PlayerMatchRecord[]>[]): Map<string, PlayerMatchRecord[]> {
    return maps
      .reduce((pv, cv) => {
        for (const [key, value] of cv.entries()) {
          pv.set(key, (pv.get(key) || []).concat(value));
        }
        return pv;
      });
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

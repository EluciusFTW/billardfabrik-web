import { Injectable } from "@angular/core";
import { PlayerMatchRecord } from "../../models/evaluation/player-match-record";
import { Match } from "../../models/match";
import { MatchPlayer } from "../../models/match-player";
import { MatchStatus } from "../../models/match-status";
import { MatchType } from "../../models/match-type";
import { Tourney } from "../../models/tourney";
import { TourneyEliminationStage } from "../../models/tourney-elimination-stage";
import { TourneyGroup } from "../../models/tourney-group";
import { TourneyMeta } from "../../models/tourney-meta";
import { tourneyEvaluationName } from "./evaluation.functions";

Injectable()
export class TourneyMatchesService {

  public Evaluate(tourney: Tourney): Map<string, PlayerMatchRecord[]> {
    const groupMatches = (tourney.groups ?? [])
      .map(group => this.GetMatchesFromGroup(tourney.meta, group));
    const singleEliminationMatches = (tourney.eliminationStages ?? [])
      .map(stage => this.GetMatchesFromStage(tourney.meta, stage));
    const doubleEliminationMatches = (tourney.doubleEliminationStages ?? [])
      .map(stage => this.GetMatchesFromStage(tourney.meta, stage));

    const allMatches = groupMatches
      .concat(singleEliminationMatches)
      .concat(doubleEliminationMatches);

    return this.ReduceMaps(allMatches);
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
    const matchType = MatchType.FromEliminationStage(stage);

    stage.matches
      .filter(match => match.status === MatchStatus.done)
      .forEach(match => {
        records[match.playerOne.name] = [this.ToPlayerMatch(meta, matchType, match, match.playerOne, match.playerTwo)];
        records[match.playerTwo.name] = [this.ToPlayerMatch(meta, matchType, match, match.playerTwo, match.playerOne)];
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
      // This is bs, should not be the time of evaluation, but at least a time stamp from the day of the tourney.
      when: new Date().valueOf(),
      type: type,
      tourney: tourneyEvaluationName(meta)
    }
  }
}

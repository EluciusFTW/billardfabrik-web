import { MatchStatus } from "src/app/tourney-series/models/match-status";
import { TourneyEliminationStage } from "src/app/tourney-series/models/tourney-elimination-stage";
import { TourneyMeta } from "../../models/tourney-meta";

export function getLosers(stage: TourneyEliminationStage): string[] {
  return stage.matches
    .filter(match => match.status === MatchStatus.done || match.status === MatchStatus.cancelled)
    .map(match => match.status === MatchStatus.done
      ? match.playerOne.points === match.length
        ? [match.playerTwo.name]
        : [match.playerOne.name]
      : [match.playerOne.name, match.playerTwo.name])
    .reduce((aggregate, current) => [...aggregate, ...current]);
}

export function tourneyEvaluationName(meta: TourneyMeta): string {
  return meta.name + '-' + meta.date;
}

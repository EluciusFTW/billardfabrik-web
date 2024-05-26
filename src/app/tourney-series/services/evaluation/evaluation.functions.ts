import { MatchStatus } from "src/app/tourney-series/models/match-status";
import { TourneyEliminationStage } from "src/app/tourney-series/models/tourney-elimination-stage";
import { TourneyMeta } from "../../models/tourney-meta";



export function tourneyEvaluationName(meta: TourneyMeta): string {
  return meta.name + '-' + meta.date;
}

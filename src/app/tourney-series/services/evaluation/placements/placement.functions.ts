import { TourneyEliminationStage } from "src/app/tourney-series/models/tourney-elimination-stage";
import { PlacementRecord } from "../../../models/evaluation/placement-record";
import { TourneyPlacementType } from "../../../models/evaluation/tourney-placement-type";
import { Tourney } from "../../../models/tourney";
import { TourneyFunctions } from "../../../tourney/tourney-functions";
import { tourneyEvaluationName } from "../evaluation.functions";
import { calculatePoints } from "../tourney-points.functions";
import { addDoubleEliminationStagePlacements } from "./double-elimination-stage-placements.functions";
import { addGroupStagePlacements } from "./group-stage-placements.functions";
import { addSingleEliminationPlacementRecords } from "./single-elimination-stage-placements.functions";
import { MatchStatus } from "src/app/tourney-series/models/match-status";

export function getPlacements(tourney: Tourney): Map<string, PlacementRecord> {
  const records = new Map<string, PlacementRecord>();

  addGroupStagePlacements(tourney, records);
  addDoubleEliminationStagePlacements(tourney, records);
  addSingleEliminationPlacementRecords(tourney, records);

  return records;
}

export function buildPlacementRecord(tourney: Tourney, placement: TourneyPlacementType): PlacementRecord {
  return {
    discipline: tourney.meta.discipline,
    placement: placement,
    tourney: tourneyEvaluationName(tourney.meta),
    points: calculatePoints(TourneyFunctions.GetPlayerCount(tourney), placement)
  }
}

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

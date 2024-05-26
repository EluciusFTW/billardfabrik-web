import { PlacementRecord } from "../../../models/evaluation/placement-record";
import { TourneyPlacementType } from "../../../models/evaluation/tourney-placement-type";
import { Tourney } from "../../../models/tourney";
import { buildPlacementRecord } from "./placement.functions";

export function addGroupStagePlacements(tourney: Tourney, results: Map<string, PlacementRecord>): void {
  (tourney.groups ?? [])
    .forEach(group => group.players
      .filter(player => !group.qualified.includes(player))
      .forEach(eliminated => results.set(eliminated, buildPlacementRecord(tourney, TourneyPlacementType.Group)))
    );
}

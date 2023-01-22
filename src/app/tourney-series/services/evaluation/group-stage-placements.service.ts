import { Injectable } from "@angular/core";
import { PlacementRecord } from "../../models/evaluation/placement-record";
import { TourneyPlacementType } from "../../models/evaluation/tourney-placement-type";
import { Tourney } from "../../models/tourney";
import { PlacementRecordBuilder } from "./placement-record.builder";

@Injectable()
export class GroupStagePlacementsService {

  constructor(private readonly recordBuilder: PlacementRecordBuilder) { }

  public Add(tourney: Tourney, results: Map<string, PlacementRecord>): void {
    tourney.groups
      .forEach(group => group.players
        .filter(player => !group.qualified.includes(player))
        .forEach(eliminated => results.set(eliminated, this.recordBuilder.Build(tourney, TourneyPlacementType.GroupStage))));
  }
}

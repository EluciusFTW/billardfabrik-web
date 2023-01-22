import { Injectable } from "@angular/core";
import { PlacementRecord } from "../../models/evaluation/placement-record";
import { TourneyPlacementType } from "../../models/evaluation/tourney-placement-type";
import { Tourney } from "../../models/tourney";
import { TourneyMeta } from "../../models/tourney-meta";
import { TourneyPointsService } from "./tourney-points.service";

@Injectable()
export class PlacementRecordBuilder {

  constructor(private readonly pointsService: TourneyPointsService) { }

  public Build(tourney: Tourney, placement: TourneyPlacementType): PlacementRecord {
    return {
      discipline: tourney.meta.discipline,
      placement: placement,
      tourney: this.ToTourneyName(tourney.meta),
      points: this.pointsService.calculate(tourney, placement)
    }
  }

  private ToTourneyName(meta: TourneyMeta): string {
    return meta.name + '-' + meta.date;
  }
}

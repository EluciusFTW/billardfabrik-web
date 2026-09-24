import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ContentTileComponent } from "../../shared/content-tile/content-tile.component";
import { MatTabGroup, MatTab } from "@angular/material/tabs";
import { TourneysLeaderBoardComponent } from "./tourneys-leader-board.component";

@Component({
  templateUrl: './tourney-leader-boards.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent, MatTabGroup, MatTab, TourneysLeaderBoardComponent]
})
export class TourneysLeaderBoardsComponent { }

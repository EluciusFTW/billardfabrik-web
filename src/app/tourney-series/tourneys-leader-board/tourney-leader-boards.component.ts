import { Component } from "@angular/core";
import { ContentTileComponent } from "src/app/shared/content-tile/content-tile.component";
import { MatTabsModule } from "@angular/material/tabs";
import { TourneysLeaderBoardComponent } from "./tourneys-leader-board.component";

@Component({
  templateUrl: './tourney-leader-boards.component.html',
  imports: [ContentTileComponent, MatTabsModule, TourneysLeaderBoardComponent]
})
export class TourneysLeaderBoardsComponent { }

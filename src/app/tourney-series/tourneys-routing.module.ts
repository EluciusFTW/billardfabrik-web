import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateTourneyComponent } from "./create-tourney/create-tourney.component";
import { TourneyListComponent } from "./tourney-list/tourney-list.component";
import { TourneySeriesOverviewComponent } from "./tourney-series-overview/tourney-series-overview.component";
import { TourneyComponent } from "./tourney/tourney.component";
import { TourneysLandingPageComponent } from "./tourneys-landing-page/tourneys-landing-page.component";
import { TourneysLeaderBoardComponent } from "./tourneys-leader-board/tourneys-leader-board.component";

const routes: Routes = [{
    path: 'tourney-series', component: TourneysLandingPageComponent, children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: TourneySeriesOverviewComponent },
      { path: ':id/tourney', component: TourneyComponent },
      { path: 'create', component: CreateTourneyComponent },
      { path: 'list', component: TourneyListComponent },
      { path: 'leaderboard', component: TourneysLeaderBoardComponent },
      { path: '**', component: TourneysLandingPageComponent }
  ]}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class TourneySeriesRoutingModule { }

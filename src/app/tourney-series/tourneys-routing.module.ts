import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TourneySeriesOverviewComponent } from "./tourney-series-overview/tourney-series-overview.component";
import { TourneysLandingPageComponent } from "./tourneys-landing-page/tourneys-landing-page.component";

const routes: Routes = [{
    path: 'tourney-series', component: TourneysLandingPageComponent, children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: TourneySeriesOverviewComponent }
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

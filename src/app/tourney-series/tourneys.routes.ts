import { Routes } from '@angular/router';
import { CreateTourneyComponent } from './create-tourney/create-tourney.component';
import { TourneyListComponent } from './tourney-list/tourney-list.component';
import { AdHocTourneyListComponent } from './tourney-list/ad-hoc-tourney-list.component';
import { TourneySeriesOverviewComponent } from './tourney-series-overview/tourney-series-overview.component';
import { TourneyComponent } from './tourney/tourney.component';
import { TourneysLandingPageComponent } from './tourneys-landing-page.component';
import { TourneysLeaderBoardsComponent } from './tourneys-leader-board/tourney-leader-boards.component';

export const routes: Routes = [{
  path: '',
  component: TourneysLandingPageComponent,
  children: [
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
    { path: 'overview', component: TourneySeriesOverviewComponent },
    { path: ':id/tourney', component: TourneyComponent },
    { path: 'create', component: CreateTourneyComponent },
    { path: 'list', component: TourneyListComponent },
    { path: 'ad-hoc', component: AdHocTourneyListComponent },
    { path: 'ad-hoc/create', component: CreateTourneyComponent, data: { adHoc: true } },
    { path: 'ad-hoc/:id/tourney', component: TourneyComponent, data: { adHoc: true } },
    { path: 'leaderboard', component: TourneysLeaderBoardsComponent },
    { path: '**', component: TourneysLandingPageComponent }
  ]
}];

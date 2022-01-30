import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BillardFabrikComponent } from './billard-fabrik.component';
import { BillardFabrikAboutComponent } from './billard-fabrik-about/billard-fabrik-about.component';
import { BillardFabrikTrainingComponent } from './billard-fabrik-training/billard-fabrik-training.component';
import { BillardFabrikMembershipComponent } from './billard-fabrik-membership/billard-fabrik-membership.component';
import { BillardFabrikLeagueComponent } from './billard-fabrik-league/billard-fabrik-league.component';
import { BillardFabrikContactComponent } from './billard-fabrik-contact/billard-fabrik-contact.component';
import { BillardFabrikTourneysComponent } from './billard-tourneys/billard-fabrik-tourneys.component';
import { CreateTourneyComponent } from '../tourneys/create-tourney/create-tourney.component';
import { TourneyComponent } from '../tourneys/tourney/tourney.component';
import { TourneyListComponent } from '../tourneys/tourney-list/tourney-list.component';
import { TourneysLandingPageComponent } from '../tourneys/tourneys-landing-page/tourneys-landing-page.component';
import { TourneySeriesOverviewComponent } from '../tourneys/tourney-series-overview/tourney-series-overview.component';
import { TourneysLeaderBoardComponent } from '../tourneys/tourneys-leader-board/tourneys-leader-board.component';

const publicAreaRoutes: Routes = [
  { path: 'die-donnerstags-serie', redirectTo: 'billardfabrik/tourney-series', pathMatch: 'full'},
  {
    path: 'billardfabrik', component: BillardFabrikComponent, children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: BillardFabrikAboutComponent },
      { path: 'league', component: BillardFabrikLeagueComponent },
      { path: 'membership', component: BillardFabrikMembershipComponent },
      { path: 'training', component: BillardFabrikTrainingComponent },
      { path: 'contact', component: BillardFabrikContactComponent },
      { path: 'tourneys', component: BillardFabrikTourneysComponent },
      {
        path: 'tourney-series', component: TourneysLandingPageComponent, children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: TourneySeriesOverviewComponent },
          { path: ':id/tourney', component: TourneyComponent },
          { path: 'create', component: CreateTourneyComponent },
          { path: 'list', component: TourneyListComponent },
          { path: 'leaderboard', component: TourneysLeaderBoardComponent }
        ]
      },
    ]
  }];

@NgModule({
  imports: [
    RouterModule.forChild(publicAreaRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class BillardFabrikRoutingModule { }

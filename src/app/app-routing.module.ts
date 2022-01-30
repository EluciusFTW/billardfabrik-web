import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillardFabrikAboutComponent } from './billard-fabrik-about/billard-fabrik-about.component';
import { BillardFabrikContactComponent } from './billard-fabrik-contact/billard-fabrik-contact.component';
import { BillardFabrikLeagueComponent } from './billard-fabrik-league/billard-fabrik-league.component';
import { BillardFabrikMembershipComponent } from './billard-fabrik-membership/billard-fabrik-membership.component';
import { BillardFabrikTrainingComponent } from './billard-fabrik-training/billard-fabrik-training.component';
import { BillardFabrikTourneysComponent } from './billard-tourneys/billard-fabrik-tourneys.component';

const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', component: BillardFabrikAboutComponent },
  { path: 'league', component: BillardFabrikLeagueComponent },
  { path: 'membership', component: BillardFabrikMembershipComponent },
  { path: 'training', component: BillardFabrikTrainingComponent },
  { path: 'contact', component: BillardFabrikContactComponent },
  { path: 'tourneys', component: BillardFabrikTourneysComponent },
  // {
  //   path: 'tourney-series', component: TourneysLandingPageComponent, children: [
  //     { path: '', redirectTo: 'overview', pathMatch: 'full' },
  //     { path: 'overview', component: TourneySeriesOverviewComponent },
  //     { path: ':id/tourney', component: TourneyComponent },
  //     { path: 'create', component: CreateTourneyComponent },
  //     { path: 'list', component: TourneyListComponent },
  //     { path: 'leaderboard', component: TourneysLeaderBoardComponent }
  //   ]
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

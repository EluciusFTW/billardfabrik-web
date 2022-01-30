import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/billard-fabrik-contact.component';
import { LeagueComponent } from './league/league.component';
import { BillardFabrikMembershipComponent } from './membership/membership.component';
import { TrainingComponent } from './training/training.component';
import { BillardFabrikTourneysComponent } from './tourneys/tourneys.component';

const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'league', component: LeagueComponent },
  { path: 'membership', component: BillardFabrikMembershipComponent },
  { path: 'training', component: TrainingComponent },
  { path: 'contact', component: ContactComponent },
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

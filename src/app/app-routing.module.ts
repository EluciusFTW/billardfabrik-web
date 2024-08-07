import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withComponentInputBinding } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LeagueComponent } from './league/league.component';
import { MembershipComponent } from './membership/membership.component';
import { TrainingComponent } from './training/training.component';
import { MensaComponent } from './mensa/mensa.component';

const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'mensa', component: MensaComponent },
  { path: 'league', component: LeagueComponent },
  { path: 'membership', component: MembershipComponent },
  { path: 'training', component: TrainingComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'tourney-series', loadChildren: () => import('./tourney-series/tourneys.module').then(m => m.TourneysModule) },
  { path: 'ranking', loadChildren: () => import('./ranking/ranking.module').then(m => m.RankingModule) }
];

@NgModule({
  providers: [provideRouter(routes, withComponentInputBinding())],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LeagueComponent } from './league/league.component';
import { MembershipComponent } from './membership/membership.component';
import { TrainingComponent } from './training/training.component';
import { BillardFabrikTourneysComponent } from './tourneys/tourneys.component';
import { MensaComponent } from './mensa/mensa.component';

const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'mensa', component: MensaComponent },
  { path: 'league', component: LeagueComponent },
  { path: 'membership', component: MembershipComponent },
  { path: 'training', component: TrainingComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'tourneys', component: BillardFabrikTourneysComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RankingComponent } from './ranking.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: 'ranking',
  component: RankingComponent,
  children: [
    // { path: '', redirectTo: 'overview', pathMatch: 'full' },
     // { path: 'overview', component: TourneySeriesOverviewComponent },
  ]
}];

@NgModule({
imports: [
  RouterModule.forChild(routes)
],
exports: [
  RouterModule
]
})
export class RankingRoutingModule { }

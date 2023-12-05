import { NgModule } from '@angular/core';
import { RankingComponent } from './ranking.component';
import { RouterModule, Routes } from '@angular/router';
import { PlayerRankingsComponent } from './player-rankings/player-rankings.component';
import { RankingMatchesComponent } from './ranking-matches/ranking-matches.component';
import { ScoringDetailsComponent } from './scoring-details/scoring-details.component';

const routes: Routes = [{
  path: 'ranking',
  component: RankingComponent,
  children: [
    { path: '', redirectTo: 'players', pathMatch: 'full' },
    { path: 'players', component: PlayerRankingsComponent },
    { path: 'matches', component: RankingMatchesComponent },
    { path: 'details', component: ScoringDetailsComponent },
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

import { NgModule } from '@angular/core';
import { RankingComponent } from './ranking.component';
import { RouterModule, Routes } from '@angular/router';
import { PlayerRankingsComponent } from './player-rankings/player-rankings.component';
import { RankingMatchesComponent } from './ranking-matches/ranking-matches.component';
import { ScoringDetailsComponent } from './scoring-details/scoring-details.component';
import { ImportMatchesComponent } from './import-matches/import-matches.component';
import { UserGuard } from '../authentication/guards/user.guard';
import { PlayerListingComponent } from '../players/player-listing/player-listing.component';

const routes: Routes = [{
  path: 'ranking',
  component: RankingComponent,
  children: [
    { path: '', redirectTo: 'players', pathMatch: 'full' },
    { path: 'players', component: PlayerRankingsComponent },
    { path: 'matches', component: RankingMatchesComponent },
    { path: 'details', component: ScoringDetailsComponent },
    { path: 'import', component: ImportMatchesComponent, canActivate: [UserGuard] },
    { path: 'player-management', component: PlayerListingComponent, canActivate: [UserGuard] }
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

import { Routes } from '@angular/router';
import { RankingComponent } from './ranking.component';
import { PlayerRankingsComponent } from './player-rankings/player-rankings.component';
import { RankingMatchesComponent } from './ranking-matches/ranking-matches.component';
import { ScoringDetailsComponent } from './scoring-details/scoring-details.component';
import { ImportMatchesComponent } from './import-matches/import-matches.component';
import { LiveChallengesComponent } from './live-challenges/live-challenges.component';
import { LiveChallengeScoresheetComponent } from './live-challenges/live-challenge-scoresheet/live-challenge-scoresheet.component';
import { UserGuard } from '../authentication/guards/user.guard';
import { PlayerListingComponent } from '../players/player-listing/player-listing.component';

export const routes: Routes = [{
  path: '',
  component: RankingComponent,
  children: [
    { path: '', redirectTo: 'players', pathMatch: 'full' },
    { path: 'players', component: PlayerRankingsComponent },
    { path: 'matches', component: RankingMatchesComponent },
    { path: 'live', component: LiveChallengesComponent },
    { path: 'live/:id', component: LiveChallengeScoresheetComponent },
    { path: 'details', component: ScoringDetailsComponent },
    { path: 'import', component: ImportMatchesComponent, canActivate: [UserGuard] },
    { path: 'player-management', component: PlayerListingComponent, canActivate: [UserGuard] }
  ]
}];

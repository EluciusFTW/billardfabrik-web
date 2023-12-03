import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';
import { RankingRoutingModule } from './ranking-routing.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PlayerRankingsComponent } from './player-rankings/player-rankings.component';
import { EloService } from './elo.service';
import { RankingMatchesComponent } from './ranking-matches/ranking-matches.component';
import { PlayerProgressionDialogComponent } from './player-rankings/player-progression-dialog.component';
import { NgChartsModule } from 'ng2-charts';
import { ScoringDetailsComponent } from './scoring-details/scoring-details.component';

@NgModule({
  declarations: [
    RankingComponent,
    PlayerRankingsComponent,
    PlayerProgressionDialogComponent,
    RankingMatchesComponent,
    ScoringDetailsComponent
  ],
  imports: [
    RankingRoutingModule,
    RouterModule,
    CommonModule,
    MaterialModule,
    NgChartsModule,
    FormsModule,
    SharedModule
  ],
  providers: [EloService]
})
export class RankingModule { }

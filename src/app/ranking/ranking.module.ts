import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';
import { RankingRoutingModule } from './ranking-routing.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PlayerRankingsComponent } from './player-rankings/player-rankings.component';
import { EloService } from './elo.service';
import { RankingMatchesComponent } from './ranking-matches/ranking-matches.component';
import { PlayerProgressionDialogComponent } from './player-rankings/player-progression-dialog.component';
import { NgChartsModule } from 'ng2-charts';
import { ScoringDetailsComponent } from './scoring-details/scoring-details.component';
import { EloDemoTableComponent } from './scoring-details/elo-demo-table/elo-demo-table.component';
import { ImportMatchesComponent } from './import-matches/import-matches.component';
import { EloImportService } from './elo-import.service';
import { ImportSingleMatchComponent } from './import-matches/import-single-match/import-single-match.component';
import { ImportTourneyComponent } from './import-matches/import-tourney/import-tourney.component';
import { TourneysModule } from '../tourney-series/tourneys.module';
import { IncomingMatchesComponent } from './ranking-matches/incoming-matches/incoming-matches.component';
import { RankedMatchesComponent } from './ranking-matches/ranked-matches/ranked-matches.component';
import { EloChallengeImportService } from './elo-challenge-import.service';

@NgModule({
  declarations: [
    RankingComponent,
    PlayerRankingsComponent,
    PlayerProgressionDialogComponent,
    RankingMatchesComponent,
    ScoringDetailsComponent,
    EloDemoTableComponent,
    ImportMatchesComponent,
    ImportSingleMatchComponent,
    ImportTourneyComponent,
    IncomingMatchesComponent,
    RankedMatchesComponent
  ],
  imports: [
    RankingRoutingModule,
    TourneysModule,
    RouterModule,
    CommonModule,
    MaterialModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    EloService,
    EloImportService,
    EloChallengeImportService
  ]
})
export class RankingModule { }

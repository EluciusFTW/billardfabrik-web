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
import { EloTourneyImportService } from './elo-tourney-import.service';
import { ImportSingleMatchComponent } from './import-matches/import-single-match/import-single-match.component';
import { ImportTourneyComponent } from './import-matches/import-tourney/import-tourney.component';
import { TourneysModule } from '../tourney-series/tourneys.module';
import { IncomingMatchesComponent } from './ranking-matches/incoming-matches/incoming-matches.component';
import { RankedMatchesComponent } from './ranking-matches/ranked-tourney-matches/ranked-tourney-matches.component';
import { EloChallengeImportService } from './elo-challenge-import.service';
import { EloRankingService } from './elo-ranking.service';
import { RankedChallengesComponent } from './ranking-matches/ranked-challenges/ranked-challenges.component';
import { EloSimulationComponent } from './scoring-details/elo-simulation/elo-simulation.component';
import { ScoreDisplayComponent } from './score-display/score-display.component';

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
    RankedMatchesComponent,
    RankedChallengesComponent,
    EloSimulationComponent,
    ScoreDisplayComponent
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
    EloTourneyImportService,
    EloChallengeImportService,
    EloRankingService
  ]
})
export class RankingModule { }

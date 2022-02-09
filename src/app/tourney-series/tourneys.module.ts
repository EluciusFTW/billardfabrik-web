import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

import { PlayersService } from './services/players.service';
// import { CreateTourneyComponent } from './create-tourney/create-tourney.component';
// import { TourneyCreationService } from './services/tourney-creation.service';
import { TourneyComponent } from './tourney/tourney.component';
import { TourneySummaryComponent } from './tourney/tourney-summary/tourney-summary.component';
import { TourneyGroupComponent } from './tourney-group/tourney-group.component';
import { TourneyGroupStageComponent } from './tourney/tourney-group-stage/tourney-group-stage.component';
import { TourneyGroupStageAddPlayerDialogComponent } from './tourney/tourney-group-stage/tourney-group-stage-add-player-dialog.component';
// import { TourneyPlayersComponent } from './tourney-players/tourney-players.component';
// import { TourneyPlayerCreateDialogComponent } from './tourney-player-create-dialog/tourney-player-create-dialog.component';
import { TourneysService } from './services/tourneys.service';

import { TourneyEliminationStagesComponent } from './tourney/tourney-elimination-stage/tourney-elimination-stages.component';
import { TourneyEliminationStageComponent } from './tourney-elimination-stage/tourney-elimination-stage.component';
import { TourneyEventService } from './services/tourney-event.service';
import { TourneyStandingCalculationService } from './services/tourney-standing-calculation.service';
import { TourneyListComponent } from './tourney-list/tourney-list.component';
import { TourneysLeaderBoardComponent } from './tourneys-leader-board/tourneys-leader-board.component';

import { TourneyEvaluationService } from './services/tourney-evaluation-service';
import { TourneyStatisticsService } from './services/tourney-statistics.service';
import { TourneyPointsService } from './services/tourney-points.service';

import { TourneysLandingPageComponent } from './tourneys-landing-page/tourneys-landing-page.component';
import { TourneySeriesOverviewComponent } from './tourney-series-overview/tourney-series-overview.component';
import { TourneySeriesRoutingModule } from './tourneys-routing.module';



@NgModule({
  imports: [
    TourneySeriesRoutingModule,
    RouterModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    TourneyComponent,
    TourneyListComponent,
    TourneyGroupComponent,
    // TourneyPlayersComponent,
    // TourneyPlayerCreateDialogComponent,
    // CreateTourneyComponent,
    TourneyGroupStageComponent,
    TourneyGroupStageAddPlayerDialogComponent,
    TourneyEliminationStagesComponent,
    TourneyEliminationStageComponent,
    TourneySummaryComponent,
    TourneysLeaderBoardComponent,
    TourneySeriesOverviewComponent,
    TourneysLandingPageComponent
  ],
  entryComponents: [
    // TourneyPlayerCreateDialogComponent,
    TourneyGroupStageAddPlayerDialogComponent
  ],
  providers: [
    // TourneyCreationService,
    TourneysService,
    TourneyEventService,
    TourneyStandingCalculationService,
    TourneyEvaluationService,
    TourneyStatisticsService,
    TourneyPointsService,
    PlayersService
  ]
})
export class TourneysModule { }

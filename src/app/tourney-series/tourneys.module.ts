import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

import { PlayersService } from './services/players.service';
import { CreateTourneyComponent } from './create-tourney/create-tourney.component';
import { TourneyCreationService } from './services/creation/tourney-creation.service';

import { TourneyComponent } from './tourney/tourney.component';
import { TourneySummaryComponent } from './tourney/tourney-summary/tourney-summary.component';
import { TourneyGroupComponent } from './tourney-group/tourney-group.component';
import { TourneyGroupStageComponent } from './tourney/tourney-group-stage/tourney-group-stage.component';
import { TourneyGroupStageAddPlayerDialogComponent } from './tourney/tourney-group-stage/tourney-group-stage-add-player-dialog.component';
import { TourneyPlayerCreateDialogComponent } from './tourney-player-create-dialog/tourney-player-create-dialog.component';
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
import { TourneyAchievementsComponent } from './tourney-achievements/tourney-achievements.component';
import { TourneyDoubleEliminationStagesComponent } from './tourney/tourney-double-elimination-stage/tourney-double-elimination-stages.component';
import { TourneyGroupStageFinalizedService } from './services/tourney-group-stage-finalized.service';
import { TourneyEliminationStageFinalizedService } from './services/tourney-elimination-stage-finalized.service';
import { TourneyModificationService } from './services/tourney-modification.service';
import { CreatingMockTourneysService } from './services/dev/creating-mock-tourneys.service';
import { SingleEliminationCreationService } from './services/creation/single-elimination-creation.service';
import { DoubleEliminationCreationService } from './services/creation/double-elimination-creation.service';
import { GroupsThenSingleEliminationCreationService } from './services/creation/groups-then-single-elimination-creation.service';
import { DoubleEliminationStageCreationService } from './services/creation/double-elimination-stage-creation.service';
import { GroupsCreationService } from './services/creation/groups-creation.service';
import { EliminationMatchesCreationService } from './services/creation/elimination-matches-creation.service';



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
    TourneyPlayerCreateDialogComponent,
    CreateTourneyComponent,
    TourneyGroupStageComponent,
    TourneyGroupStageAddPlayerDialogComponent,
    TourneyEliminationStagesComponent,
    TourneyEliminationStageComponent,
    TourneySummaryComponent,
    TourneysLeaderBoardComponent,
    TourneySeriesOverviewComponent,
    TourneysLandingPageComponent,
    TourneyAchievementsComponent,
    TourneyDoubleEliminationStagesComponent
  ],
  entryComponents: [
    TourneyPlayerCreateDialogComponent,
    TourneyGroupStageAddPlayerDialogComponent
  ],
  providers: [
    TourneyCreationService,
    EliminationMatchesCreationService,
    SingleEliminationCreationService,
    DoubleEliminationCreationService,
    DoubleEliminationStageCreationService,
    GroupsCreationService,
    GroupsThenSingleEliminationCreationService,
    TourneyModificationService,
    // TourneysService,
    { provide: TourneysService, useClass: CreatingMockTourneysService },
    TourneyEventService,
    TourneyGroupStageFinalizedService,
    TourneyEliminationStageFinalizedService,
    TourneyStandingCalculationService,
    TourneyEvaluationService,
    TourneyStatisticsService,
    TourneyPointsService,
    PlayersService
  ]
})
export class TourneysModule { }

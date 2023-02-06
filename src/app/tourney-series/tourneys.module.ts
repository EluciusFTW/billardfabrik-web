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
import { TourneyEventService } from './services/event-handling/tourney-event.service';
import { TourneyStandingCalculationService } from './services/tourney-standing-calculation.service';
import { TourneyListComponent } from './tourney-list/tourney-list.component';
import { TourneysLeaderBoardComponent } from './tourneys-leader-board/tourneys-leader-board.component';

import { TourneyStatisticsService } from './services/evaluation/tourney-statistics.service';
import { TourneyPointsService } from './services/evaluation/tourney-points.service';

import { TourneysLandingPageComponent } from './tourneys-landing-page/tourneys-landing-page.component';
import { TourneySeriesOverviewComponent } from './tourney-series-overview/tourney-series-overview.component';
import { TourneySeriesRoutingModule } from './tourneys-routing.module';
import { TourneyAchievementsComponent } from './tourney-achievements/tourney-achievements.component';
import { TourneyDoubleEliminationStagesComponent } from './tourney/tourney-double-elimination-stage/tourney-double-elimination-stages.component';
import { GroupStageFinalizedService } from './services/event-handling/group-stage-finalized.service';
import { SingleEliminationStageFinalizedService } from './services/event-handling/single-elimination-stage-finalized.service';
import { CreatingMockTourneysService } from './services/dev/creating-mock-tourneys.service';
import { SingleEliminationCreationService } from './services/creation/single-elimination-creation.service';
import { DoubleEliminationCreationService } from './services/creation/double-elimination-creation.service';
import { GroupsThenSingleEliminationCreationService } from './services/creation/groups-then-single-elimination-creation.service';
import { DoubleEliminationStageCreationService } from './services/creation/double-elimination-stage-creation.service';
import { GroupsCreationService } from './services/creation/groups-creation.service';
import { EliminationMatchesCreationService } from './services/creation/elimination-matches-creation.service';
import { DoubleEliminationStageFinalizedService } from './services/event-handling/double-elimination-stage-finalized.service';
import { TourneyMatchesService } from './services/evaluation/tourney-matches.service';
import { TourneyPlacementsService } from './services/evaluation/tourney-placements.service';
import { DoubleEliminationStagePlacementsService } from './services/evaluation/stages/double-elimination-stage-placements.service';
import { SingleEliminationStagePlacementsService } from './services/evaluation/stages/single-elimination-stage-placements.service';
import { GroupStagePlacementsService } from './services/evaluation/stages/group-stage-placements.service';
import { PlacementRecordBuilder } from './services/evaluation/placement-record.builder';
import { TourneyYearListComponent } from './tourney-list/tourney-year-list.component';



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
    TourneyYearListComponent,
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
    {
      provide: TourneysService,
      useClass: TourneysService // CreatingMockTourneysService
    },
    TourneyEventService,
    GroupStageFinalizedService,
    SingleEliminationStageFinalizedService,
    DoubleEliminationStageFinalizedService,
    TourneyStandingCalculationService,
    TourneyStatisticsService,
    TourneyPlacementsService,
    DoubleEliminationStagePlacementsService,
    SingleEliminationStagePlacementsService,
    GroupStagePlacementsService,
    PlacementRecordBuilder,
    TourneyMatchesService,
    TourneyPointsService,
    PlayersService
  ]
})
export class TourneysModule { }

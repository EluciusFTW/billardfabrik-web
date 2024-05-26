import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

import { TourneyPlayersService } from './services/tourney-players.service';
import { CreateTourneyComponent } from './create-tourney/create-tourney.component';
import { TourneyCreationService } from './create-tourney/tourney-creation.service';

import { TourneyComponent } from './tourney/tourney.component';
import { TourneySummaryComponent } from './tourney/tourney-summary/tourney-summary.component';
import { TourneyGroupComponent } from './tourney-group/tourney-group.component';
import { TourneyGroupStageComponent } from './tourney/tourney-group-stage/tourney-group-stage.component';
import { TourneyGroupStageAddPlayerDialogComponent } from './tourney/tourney-group-stage/tourney-group-stage-add-player-dialog.component';
import { TourneysService } from './services/tourneys.service';

import { TourneyEliminationStagesComponent } from './tourney/tourney-elimination-stage/tourney-elimination-stages.component';
import { TourneyEliminationStageComponent } from './tourney-elimination-stage/tourney-elimination-stage.component';
import { TourneyEventService } from './event-handling/tourney-event.service';
import { TourneyListComponent } from './tourney-list/tourney-list.component';
import { TourneysLeaderBoardComponent } from './tourneys-leader-board/tourneys-leader-board.component';

import { TourneyStatisticsService } from './services/evaluation/tourney-statistics.service';

import { TourneysLandingPageComponent } from './tourneys-landing-page.component';
import { TourneySeriesOverviewComponent } from './tourney-series-overview/tourney-series-overview.component';
import { TourneySeriesRoutingModule } from './tourneys-routing.module';
import { TourneyDoubleEliminationStagesComponent } from './tourney/tourney-double-elimination-stage/tourney-double-elimination-stages.component';
import { TourneyYearListComponent } from './tourney-list/tourney-year-list.component';
import { ShowResultsDialogComponent } from './tourney-list/show-results.dialog.component';
import { TourneysLeaderBoardsComponent } from './tourneys-leader-board/tourney-leader-boards.component';
import { MatchComponent } from './match/match.component';
import { DateKeyPipe } from './date-key.pipe';
import { PlayersModule } from '../players/players.module';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { OrderPlayersDialogComponent } from './create-tourney/order-players/order-players-dialog.component';

@NgModule({
    imports: [
        TourneySeriesRoutingModule,
        RouterModule,
        CommonModule,
        MaterialModule,
        CdkDropList,
        CdkDrag,
        FormsModule,
        PlayersModule,
        SharedModule
    ],
    exports: [DateKeyPipe],
    declarations: [
        TourneyComponent,
        TourneyListComponent,
        TourneyYearListComponent,
        TourneyGroupComponent,
        ShowResultsDialogComponent,
        CreateTourneyComponent,
        OrderPlayersDialogComponent,
        TourneyGroupStageComponent,
        TourneyGroupStageAddPlayerDialogComponent,
        TourneyEliminationStagesComponent,
        TourneyEliminationStageComponent,
        TourneySummaryComponent,
        TourneysLeaderBoardComponent,
        TourneysLeaderBoardsComponent,
        TourneySeriesOverviewComponent,
        TourneysLandingPageComponent,
        TourneyDoubleEliminationStagesComponent,
        MatchComponent,
        DateKeyPipe
    ],
    providers: [
        TourneyCreationService,
        TourneysService,
        TourneyEventService,
        TourneyStatisticsService,
        TourneyPlayersService,
    ]
})
export class TourneysModule { }

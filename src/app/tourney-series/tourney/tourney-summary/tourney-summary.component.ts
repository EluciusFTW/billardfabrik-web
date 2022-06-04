import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyStatus, TourneyStatusMapper } from '../../models/tourney-status';
import { ResultsPostProcessedEvent, ScoreChangedEvent, StartEvent, TourneyPhaseEvent } from '../../models/tourney-phase-event';
import { PoolDisciplineMapper } from '../../models/pool-discipline';
import { TourneyEvaluationService } from '../../services/tourney-evaluation-service';
import { TourneyStatisticsService } from '../../services/tourney-statistics.service';
import { PlayersService } from '../../services/players.service';
import { TourneyPhaseStatus } from '../../models/tourney-phase-status';
import { MatDialog } from '@angular/material/dialog';
import { TourneyGroupStageAddPlayerDialogComponent } from '../tourney-group-stage/tourney-group-stage-add-player-dialog.component';
import { TourneyModeMapper } from '../../models/tourney-mode';
import { TourneyModificationService } from '../../services/tourney-modification.service';
// import { UserService } from 'src/app/authenticated-area/user.service';

@Component({
  selector: 'app-tourney-summary',
  templateUrl: './tourney-summary.component.html',
  styleUrls: ['./tourney-summary.component.scss']
})
export class TourneySummaryComponent {

  @Input()
  tourney: Tourney;

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();

  constructor(
    private modificationService: TourneyModificationService,
    private evaluationService: TourneyEvaluationService,
    private statisticsService: TourneyStatisticsService,
    private playersService: PlayersService,
    public dialog: MatDialog,
    // private userService: UserService
  ) { }

  addPlayer(): void {
    const dialogRef = this.dialog.open(TourneyGroupStageAddPlayerDialogComponent, {
      data: {},
      width: '300px',
      hasBackdrop: true
    });

    dialogRef
      .afterClosed()
      .subscribe(
        name => {
          if (name) {
            this.modificationService.injectPlayer(this.tourney, name);
            this.change.emit(new ScoreChangedEvent());
          }
        }
      )
  }

  displayStatus(): string {
    return this.tourney
      ? TourneyStatusMapper.map(this.tourney.meta.status)
      : 'Loading ...';
  }

  canAddPlayers(): boolean {
    return true;
    // return this.userService.canHandleTourneys();
  }

  getDiscipline(): string {
    return PoolDisciplineMapper.map(this.tourney?.meta?.discipline);
  }

  getModus(): string {
    return TourneyModeMapper.map(this.tourney?.meta?.modus);
  }

  getWinner(): string {
    return this.evaluationService.GetWinner(this.tourney);
  }

  getSecondPlace(): string {
    return this.evaluationService.GetSecondPlace(this.tourney);
  }

  getThirdPlace(): string {
    return this.evaluationService.GetThirdPlace(this.tourney);
  }

  getCount(): number {
    return this.evaluationService.GetPlayerCount(this.tourney);
  }

  calculate(): void {
    if (this.tourney.meta.status !== TourneyStatus.postProcessed) {
      var result = this.statisticsService.Evaluate(this.tourney);
      if (result) {
        result.players.forEach(evaluation => this.playersService.AddPlayerRecord(evaluation));
      }
      this.change.emit(new ResultsPostProcessedEvent());
    }
  }

  someGroupFinished(): boolean {
    return this.tourney.groups.some(group => group.status === TourneyPhaseStatus.finalized)
  }

  canStart(): boolean {
    return true;
    // return this.userService.canHandleTourneys();
  }

  canCompute(): boolean {
    return true;
    // return this.userService.isAdmin() && this.tourney.meta.status !== TourneyStatus.postProcessed;
  }

  start(): void {
    this.change.emit(new StartEvent());
  }
}

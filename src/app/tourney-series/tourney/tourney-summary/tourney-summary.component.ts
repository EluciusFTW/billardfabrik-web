import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyStatus, TourneyStatusMapper } from '../../models/tourney-status';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';
import { PoolDisciplineMapper } from '../../models/pool-discipline';
import { SummaryFunctions } from './summary-functions';
import { TourneyStatisticsService } from '../../services/evaluation/tourney-statistics.service';
import { PlayersService } from '../../services/players.service';
import { MatDialog } from '@angular/material/dialog';
import { TourneyGroupStageAddPlayerDialogComponent } from '../tourney-group-stage/tourney-group-stage-add-player-dialog.component';
import { TourneyMode, TourneyModeMapper } from '../../models/tourney-mode';
import { TourneyModificationService } from '../../services/tourney-modification.service';
import { UserService } from 'src/app/authentication/user.service';

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
    private statisticsService: TourneyStatisticsService,
    private playersService: PlayersService,
    public dialog: MatDialog,
    private userService: UserService
  ) { }

  addPlayer(): void {
    const dialogRef = this.dialog.open(TourneyGroupStageAddPlayerDialogComponent);

    dialogRef
      .afterClosed()
      .subscribe(
        name => {
          if (name) {
            this.modificationService.injectPlayer(this.tourney, name);
            this.change.emit({ type: 'ScoreChanged' });
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
    return this.userService.canHandleTourneys();
  }

  getDiscipline(): string {
    return PoolDisciplineMapper.map(this.tourney?.meta?.discipline);
  }

  getModus(): string {
    return TourneyModeMapper.map(this.tourney?.meta?.modus ?? 0);
  }

  getWinner(): string {
    return SummaryFunctions.GetWinner(this.tourney);
  }

  getSecondPlace(): string {
    return SummaryFunctions.GetSecondPlace(this.tourney);
  }

  getThirdPlace(): string {
    return SummaryFunctions.GetThirdPlace(this.tourney);
  }

  getCount(): number {
    return SummaryFunctions.GetPlayerCount(this.tourney);
  }

  calculate(): void {
    if (this.tourney.meta.status !== TourneyStatus.postProcessed) {
      var result = this.statisticsService.Evaluate(this.tourney);
      if (result) {
        result.players.forEach(evaluation => this.playersService.AddPlayerRecord(evaluation));
      }
      this.change.emit({ type: 'ResultsPostProcessed' });
    }
  }

  canStart(): boolean {
    return this.userService.canHandleTourneys();
  }

  canCompute(): boolean {
    // Evaluation of double elimination tourneys is still not implemented
    return this.userService.canHandleTourneys()
      && this.tourney.meta.status === TourneyStatus.completed
      && this.tourney.meta.modus === TourneyMode.GroupsThenSingleElimination
  }

  start(): void {
    this.change.emit({ type: 'Started' });
  }
}

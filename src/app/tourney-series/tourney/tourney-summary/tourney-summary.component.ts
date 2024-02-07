import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyStatus, TourneyStatusMapper } from '../../models/tourney-status';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';
import { TourneyFunctions } from '../tourney-functions';
import { TourneyStatisticsService } from '../../services/evaluation/tourney-statistics.service';
import { PlayersService } from '../../services/players.service';
import { MatDialog } from '@angular/material/dialog';
import { TourneyGroupStageAddPlayerDialogComponent } from '../tourney-group-stage/tourney-group-stage-add-player-dialog.component';
import { ModificationFunctions } from './modification-functions';
import { UserService } from 'src/app/authentication/user.service';

@Component({
  selector: 'app-tourney-summary',
  templateUrl: './tourney-summary.component.html',
  styleUrls: ['./tourney-summary.component.scss']
})
export class TourneySummaryComponent {

  @Input({ required: true })
  tourney: Tourney;

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();

  constructor(
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
            ModificationFunctions.InjectPlayer(this.tourney, name);
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

  getWinner(): string {
    return TourneyFunctions.GetWinner(this.tourney);
  }

  getSecondPlace(): string {
    return TourneyFunctions.GetSecondPlace(this.tourney);
  }

  getThirdPlace(): string {
    return TourneyFunctions.GetThirdPlace(this.tourney);
  }

  getCount(): number {
    return TourneyFunctions.GetPlayerCount(this.tourney);
  }

  calculate(): void {
    if (this.tourney.meta.status !== TourneyStatus.postProcessed) {
      const result = this.statisticsService.Evaluate(this.tourney);
      if (result) {
        result.players.forEach(evaluation => this.playersService.AddPlayerRecord(evaluation));
      }
      this.change.emit({ type: 'ResultsPostProcessed' });
    }
  }

  get canStart(): boolean {
    return this.userService.canHandleTourneys();
  }

  get canCompute(): boolean {
    // Evaluation of double elimination tourneys is still not implemented
    return this.userService.canHandleTourneys()
      && this.tourney.meta.status === TourneyStatus.completed
      && this.tourney.meta.modus === 'Gruppe + Einfach-K.O.'
  }

  start(): void {
    this.change.emit({ type: 'Started' });
  }
}

import { Component, Input, EventEmitter, Output, input, inject, computed } from '@angular/core';
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
  private statisticsService = inject(TourneyStatisticsService);
  private playersService = inject(PlayersService);
  public dialog = inject(MatDialog);
  private userService = inject(UserService);

  tourney = input.required<Tourney>();
  isOver = computed(() => this.tourney().meta.status >= TourneyStatus.completed);
  getWinner = computed(() => TourneyFunctions.GetWinner(this.tourney()));
  getSecondPlace = computed(() => TourneyFunctions.GetSecondPlace(this.tourney()));
  getThirdPlace = computed(() => TourneyFunctions.GetThirdPlace(this.tourney()));
  getCount = computed(() => TourneyFunctions.GetPlayerCount(this.tourney()));
  displayStatus = computed(() => TourneyStatusMapper.map(this.tourney().meta.status));
  canAddPlayers = computed(() => this.userService.canHandleTourneys());
  canStart = computed(() => this.userService.canHandleTourneys());
  canCompute = computed(() =>
    this.userService.canHandleTourneys()
    && this.tourney().meta.status === TourneyStatus.completed
    && this.tourney().meta.modus === 'Gruppe + Einfach-K.O.');

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();

  addPlayer(): void {
    const dialogRef = this.dialog.open(TourneyGroupStageAddPlayerDialogComponent);

    dialogRef
      .afterClosed()
      .subscribe(
        name => {
          if (name) {
            ModificationFunctions.InjectPlayer(this.tourney(), name);
            this.change.emit({ type: 'ScoreChanged' });
          }
        }
      )
  }

  async calculate(): Promise<void> {
    if (this.tourney().meta.status !== TourneyStatus.postProcessed) {
      const result = this.statisticsService.Evaluate(this.tourney());
      if (result) {
        let updates = result.players.map(evaluation => this.playersService.AddPlayerRecord(evaluation));
        await Promise.all(updates);
        this.change.emit({ type: 'ResultsPostProcessed' });
      }
    }
  }

  start(): void {
    this.change.emit({ type: 'Started' });
  }
}

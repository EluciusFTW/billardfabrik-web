import { Component, computed, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom, map } from 'rxjs';
import { UserService } from 'src/app/authentication/user.service';
import { Tourney } from '../models/tourney';
import { TourneyStatus, TourneyStatusMapper } from '../models/tourney-status';
import { TourneyStatisticsService } from '../services/evaluation/tourney-statistics.service';
import { TourneyPlayersService } from '../services/tourney-players.service';
import { TourneysService } from '../services/tourneys.service';
import { ShowResultsDialogComponent } from './show-results.dialog.component';
import { MaterialModule } from 'src/app/material/material.module';
import { DateKeyPipe } from '../date-key.pipe';
import { RouterModule } from '@angular/router';
import { Db } from 'src/app/shared/firebase-utilities';

@Component({
  selector: 'app-tourney-year-list',
  templateUrl: './tourney-year-list.component.html',
  imports: [MaterialModule, DateKeyPipe, RouterModule]
})
export class TourneyYearListComponent {
  private tourneysService = inject(TourneysService);
  private statisticsService = inject(TourneyStatisticsService);
  private playersService = inject(TourneyPlayersService);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  public year = input<number>(0);
  public startingAt = input<string>('20180101');
  public endingAt = input<string>('20501231');

  protected isTourneyAuthenticated = computed(() => this.userService.canHandleTourneys());

  protected tourneyDataSource: MatTableDataSource<Tourney>;
  protected displayedColumns = ['name', 'date', 'status', 'actions'];

  async ngOnInit() {
    const tourneySource = this.year() > 0
      ? this.tourneysService.getFromYear(this.year())
      : this.tourneysService.getBetween(this.startingAt(), this.endingAt());

    const tourneys = await firstValueFrom(
      tourneySource
        .pipe(
          map(tourneys =>
            tourneys
              .filter(tourney => this.isTourneyAuthenticated() || tourney.meta.status !== TourneyStatus.new)
              .reverse())));
    this.tourneyDataSource = new MatTableDataSource<Db<Tourney>>(tourneys);
  }

  show(tourney: Tourney) {
    const result = this.statisticsService.Evaluate(tourney);
    this.dialog.open(ShowResultsDialogComponent, { data: result })
  }

  async calculate(tourney: Tourney) {
    if (tourney.meta.status !== TourneyStatus.completed) {
      return;
    }

    const result = this.statisticsService.Evaluate(tourney);
    if (result) {
      let updates = result.players.map(evaluation => this.playersService.addPlayerRecord(evaluation));
      await Promise.all(updates);
      this.tourneysService.update(tourney, { type: 'ResultsPostProcessed' });
    }
  }


  canComplete(status: TourneyStatus): boolean {
    return this.userService.canHandleTourneys()
      && status === TourneyStatus.completed;
  }

  mapTourneyState(status: TourneyStatus) {
    return TourneyStatusMapper.map(status);
  }
}

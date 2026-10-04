import { Component, input, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { firstValueFrom, map } from 'rxjs';
import { UserService } from 'src/app/authentication/user.service';
import { Tourney } from '../models/tourney';
import { TourneyStatus, TourneyStatusMapper } from '../models/tourney-status';
import { TourneyStatisticsService } from '../services/evaluation/tourney-statistics.service';
import { TourneyPlayersService } from '../services/tourney-players.service';
import { TourneysService } from '../services/tourneys.service';
import { ShowResultsDialogComponent } from './show-results.dialog.component';
import { RouterLink } from '@angular/router';
import { DateKeyPipe } from '../date-key.pipe';

@Component({
  selector: 'app-tourney-year-list',
  templateUrl: './tourney-year-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, RouterLink, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, DateKeyPipe]
})
export class TourneyYearListComponent {
  private tourneysService = inject(TourneysService);
  private statisticsService = inject(TourneyStatisticsService);
  private playersService = inject(TourneyPlayersService);
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  year = input<number>(0);
  startingAt = input<string>('20180101');
  endingAt = input<string>('20501231');
  adHoc = input(false);

  isTourneyAuthenticated = computed(() => this.userService.canHandleTourneys());

  tourneyDataSource: MatTableDataSource<Tourney>;
  displayedColumns = ['name', 'date', 'status', 'actions'];

  async ngOnInit() {
    const tourneySource = this.adHoc()
      ? this.tourneysService.getAdHoc()
      : this.year() > 0
        ? this.tourneysService.getFromYear(this.year())
        : this.tourneysService.getBetween(this.startingAt(), this.endingAt());

    const tourneys = await firstValueFrom(
      tourneySource
        .pipe(
          map(tourneys =>
            tourneys
              .filter(tourney => this.isTourneyAuthenticated() || tourney.meta.status !== TourneyStatus.new)
              .reverse())));
    this.tourneyDataSource = new MatTableDataSource<Tourney>(tourneys);
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

  tourneyLink(tourney: Tourney): string {
    const key = (<any>tourney).key;
    return this.adHoc() ? `${key}/tourney` : `../${key}/tourney`;
  }

  canComplete(status: TourneyStatus): boolean {
    return !this.adHoc()
      && this.userService.canHandleTourneys()
      && status === TourneyStatus.completed;
  }

  mapTourneyState(status: TourneyStatus) {
    return TourneyStatusMapper.map(status);
  }
}

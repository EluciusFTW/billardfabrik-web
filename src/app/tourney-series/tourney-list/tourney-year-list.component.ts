import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Subscription } from "rxjs";
import { UserService } from "src/app/authentication/user.service";
import { Tourney } from "../models/tourney";
import { TourneyStatus, TourneyStatusMapper } from "../models/tourney-status";
import { TourneyStatisticsService } from "../services/evaluation/tourney-statistics.service";
import { PlayersService } from "../services/players.service";
import { TourneysService } from "../services/tourneys.service";
import { ShowResultsDialogComponent } from "./show-results.dialog.component";

@Component({
  selector: 'app-tourney-year-list',
  templateUrl: './tourney-year-list.component.html'
})
export class TourneyYearListComponent implements OnInit {

  @Input()
  year: number = 0;

  @Input()
  startingAt: string = "20180101";

  @Input()
  endingAt: string = "20501231";

  private tourneysSub: Subscription;

  tourneyDataSource: MatTableDataSource<Tourney>;
  displayedColumns = ['name', 'date', 'status', 'actions'];

  constructor(
    private tourneysService: TourneysService,
    private statisticsService: TourneyStatisticsService,
    private playersService: PlayersService,
    private userService: UserService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    const tourneySource = this.year > 0
      ? this.tourneysService.getFromYear(this.year)
      : this.tourneysService.getBetween(this.startingAt, this.endingAt);

    this.tourneysSub = tourneySource
      .subscribe(
        tourneys => {
          let ts = tourneys
            .filter(tourney => this.isTourneyAuthenticated || tourney.meta.status !== TourneyStatus.new)
            .reverse();
          this.tourneyDataSource = new MatTableDataSource<Tourney>(ts);
        });
  }

  show(tourney: Tourney) {
    const result = this.statisticsService.Evaluate(tourney);
    this.dialog.open(ShowResultsDialogComponent, { data: result })
  }

  calculate(tourney: Tourney) {
    if (tourney.meta.status !== TourneyStatus.completed) {
      return;
    }

    const result = this.statisticsService.Evaluate(tourney);
    if (result) {
      result.players.forEach(evaluation => this.playersService.AddPlayerRecord(evaluation));
      this.tourneysService.update(tourney, { type: 'ResultsPostProcessed' });
    }
  }

  get isTourneyAuthenticated(): boolean {
    return this.userService.canHandleTourneys();
  }

  canComplete(status: TourneyStatus): boolean {
    return this.userService.canHandleTourneys()
      && status === TourneyStatus.completed;
  }

  mapTourneyState(status: TourneyStatus) {
    return TourneyStatusMapper.map(status);
  }

  ngOnDestroy() {
    this.tourneysSub.unsubscribe();
  }
}

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
  year: number;

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
    this.tourneysSub = this.tourneysService
      .getFromYear(this.year)
      .subscribe(
        tourneys => {
          let ts = this.isTourneyAuthenticated()
            ? tourneys
            : tourneys.filter(tourney => tourney.meta.status !== TourneyStatus.new);
          this.tourneyDataSource = new MatTableDataSource<Tourney>(ts.reverse());
        }
      );
  }

  show(tourney: Tourney) {
    var result = this.statisticsService.Evaluate(tourney);
    this.dialog.open(ShowResultsDialogComponent, { data: result })
  }

  calculate(tourney: Tourney) {
    if (tourney.meta.status !== TourneyStatus.completed) {
      return;
    }

    var result = this.statisticsService.Evaluate(tourney);
    if (result) {
      result.players.forEach(evaluation => this.playersService.AddPlayerRecord(evaluation));
      this.tourneysService.update(tourney, { type: 'ResultsPostProcessed' });
    }
  }

  niceName(dateName: string): string {
    const year = +dateName.substring(0, 4);
    const month = +dateName.substring(4, 6);
    const day = +dateName.substring(6, 8);
    return new Date(year, month - 1, day).toLocaleDateString();
  }

  isTourneyAuthenticated(): boolean {
    return this.userService.canHandleTourneys();
  }

  canComplete(status: TourneyStatus): boolean {
    return this.userService.canHandleTourneys()
      && status === TourneyStatus.completed;
  }

  mapTourneyState(status: TourneyStatus) {
    return TourneyStatusMapper.map(status);
  }

  addOccurence(): void {
    this.tourneysService.addNumber();
  }



  ngOnDestroy() {
    this.tourneysSub.unsubscribe();
  }
}

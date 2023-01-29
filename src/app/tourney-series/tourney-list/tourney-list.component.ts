import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Tourney } from '../models/tourney';
import { TourneyStatus, TourneyStatusMapper } from '../models/tourney-status';
import { TourneysService } from '../services/tourneys.service';
import { UserService } from 'src/app/authentication/user.service';

@Component({
  templateUrl: './tourney-list.component.html',
  styleUrls: ['./tourney-list.component.scss']
})
export class TourneyListComponent implements OnDestroy {

  tourneys: Tourney[] = [];
  private tourneysSub: Subscription;

  tourneyDataSource = new MatTableDataSource<Tourney>(this.tourneys);
  displayedColumns = ['name', 'date', 'status'];

  constructor(private tourneysService: TourneysService, private userService: UserService) {
    this.tourneysSub = this.tourneysService
      .getAll()
      .subscribe(
        tourneys => {
          this.tourneys = this.isTourneyAuthenticated()
            ? tourneys
            : tourneys.filter(tourney => tourney.meta.status !== TourneyStatus.new);
          this.tourneyDataSource = new MatTableDataSource<Tourney>(this.tourneys.reverse());
        }
      )
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

  mapTourneyState(status: TourneyStatus) {
    return TourneyStatusMapper.map(status);
  }

  ngOnDestroy() {
    this.tourneysSub.unsubscribe();
  }
}

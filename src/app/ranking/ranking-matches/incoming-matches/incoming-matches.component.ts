import { Component } from '@angular/core';
import { IncomingMatch } from '../../models/ranking-match';
import { MatTableDataSource } from '@angular/material/table';
import { EloService } from '../../elo.service';
import { Subscription, take } from 'rxjs';
import { UserService } from 'src/app/authentication/user.service';

@Component({
  selector: 'app-incoming-matches',
  templateUrl: './incoming-matches.component.html',
  styleUrls: ['./incoming-matches.component.scss']
})
export class IncomingMatchesComponent {
  unrankedMatchSubscription: Subscription;

  unrankedMatches: IncomingMatch[];
  dataSource = new MatTableDataSource<IncomingMatch>();
  displayedColumns = ['date', 'p1', 'p2', 'score'];

  constructor(
    private readonly eloService: EloService,
    private readonly userService: UserService)
  { }

  ngOnInit(): void {
    this.SetDataSource();
  }

  async Calculate(): Promise<void> {
    await this.eloService.UpdateEloScores();
    this.SetDataSource();
  }

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  private SetDataSource() {
    this.eloService
      .GetUnrankedMatches()
      .pipe(take(1))
      .subscribe(
        matches => {
          this.unrankedMatches = matches
            .map(match => ({
              ...match,
              p1: match.playerOne.name,
              p2: match.playerTwo.name
            }))
            .reverse();
          this.dataSource = new MatTableDataSource(this.unrankedMatches);
        });
  }
}

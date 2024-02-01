import { Component, inject } from '@angular/core';
import { IncomingMatch } from '../../models/ranking-match';
import { MatTableDataSource } from '@angular/material/table';
import { EloService } from '../../elo.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/authentication/user.service';
import { EloRankingService } from '../../elo-ranking.service';

@Component({
  selector: 'app-incoming-matches',
  templateUrl: './incoming-matches.component.html',
  styleUrls: ['../ranked-matches/ranked-matches.component.scss']
})
export class IncomingMatchesComponent {
  private readonly eloService = inject(EloService);
  private readonly eloRankingService = inject(EloRankingService);
  private readonly userService = inject(UserService);

  unrankedMatchSubscription: Subscription;
  unrankedMatches: IncomingMatch[];
  dataSource = new MatTableDataSource<IncomingMatch>();
  displayedColumns = ['date', 'p1', 'p2', 'score'];

  ngOnInit(): void {
    this.SetDataSource();
  }

  async Calculate(): Promise<void> {
    await this.eloService.UpdateEloScores();
    await this.SetDataSource();
  }

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  private async SetDataSource() {
    const matches = await this.eloRankingService.GetUnrankedMatches();
    this.unrankedMatches = matches
      .map(match => ({
        ...match,
        p1: match.playerOne.name,
        p2: match.playerTwo.name
      }))
      .reverse();
    this.dataSource = new MatTableDataSource(this.unrankedMatches);
  }
}

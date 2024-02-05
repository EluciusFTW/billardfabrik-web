import { Component, inject } from '@angular/core';
import { IncomingMatch } from '../../models/ranking-match';
import { MatTableDataSource } from '@angular/material/table';
import { EloService } from '../../elo.service';
import { EloRankingService } from '../../elo-ranking.service';
import { AuthorizedComponent } from 'src/app/shared/authorized.component';

@Component({
  selector: 'app-incoming-matches',
  templateUrl: './incoming-matches.component.html',
  styleUrls: ['../ranked-matches/ranked-matches.component.scss']
})
export class IncomingMatchesComponent extends AuthorizedComponent {
  private readonly eloService = inject(EloService);
  private readonly eloRankingService = inject(EloRankingService);

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

import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { IncomingMatch } from '../../models/ranking-match';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { EloService } from '../../elo.service';
import { EloRankingService } from '../../elo-ranking.service';
import { AuthorizedComponent } from 'src/app/shared/authorized.component';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { DateKeyPipe } from '../../../tourney-series/date-key.pipe';

@Component({
  selector: 'app-incoming-matches',
  templateUrl: './incoming-matches.component.html',
  styleUrls: ['../ranked-tourney-matches/ranked-tourney-matches.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatToolbar, MatButton, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, DateKeyPipe]
})
export class IncomingMatchesComponent extends AuthorizedComponent {
  private readonly eloService = inject(EloService);
  private readonly eloRankingService = inject(EloRankingService);

  unrankedMatches: IncomingMatch[];
  dataSource = new MatTableDataSource<IncomingMatch>();
  displayedColumns = ['date', 'discipline', 'p1', 'p2', 'score'];

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

import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { IncomingMatch } from '../../models/ranking-match';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { EloRankingService } from '../../elo-ranking.service';
import { ScoreDisplayComponent } from '../../score-display/score-display.component';
import { DateKeyPipe } from '../../../tourney-series/date-key.pipe';

@Component({
  selector: 'app-ranked-tourney-matches',
  templateUrl: './ranked-tourney-matches.component.html',
  styleUrls: ['./ranked-tourney-matches.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, ScoreDisplayComponent, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, DateKeyPipe]
})
export class RankedMatchesComponent implements OnInit {
  private readonly eloRankingService = inject(EloRankingService);

  dataSource = new MatTableDataSource<IncomingMatch>([]);
  displayedColumns = ['date', 'discipline', 'p1', 'p2', 'score', 'diff'];

  async ngOnInit() {
    const matches = await firstValueFrom(this.eloRankingService.GetRankedTourneyMatches(50));
    this.dataSource = new MatTableDataSource(matches.reverse());
  }
}

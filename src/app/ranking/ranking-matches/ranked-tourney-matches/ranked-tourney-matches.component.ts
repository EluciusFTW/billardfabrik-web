import { Component, OnInit, inject } from '@angular/core';
import { IncomingMatch } from '../../models/ranking-match';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { EloRankingService } from '../../elo-ranking.service';

@Component({
  selector: 'app-ranked-tourney-matches',
  templateUrl: './ranked-tourney-matches.component.html',
  styleUrls: ['./ranked-tourney-matches.component.scss']
})
export class RankedMatchesComponent implements OnInit {
  private readonly eloRankingService = inject(EloRankingService);

  dataSource = new MatTableDataSource<IncomingMatch>([]);
  displayedColumns = ['date', 'p1', 'p2', 'score', 'diff'];

  async ngOnInit() {
    const matches = await firstValueFrom(this.eloRankingService.GetRankedTourneyMatches(50));
    this.dataSource = new MatTableDataSource(matches.reverse());
  }
}

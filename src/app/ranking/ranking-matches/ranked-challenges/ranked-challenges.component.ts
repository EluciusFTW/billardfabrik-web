import { Component, OnInit, inject } from '@angular/core';
import { IncomingMatch } from '../../models/ranking-match';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom, take } from 'rxjs';
import { EloRankingService } from '../../elo-ranking.service';

@Component({
  selector: 'app-ranked-challenges',
  templateUrl: './ranked-challenges.component.html',
  styleUrls: ['./ranked-challenges.component.scss']
})
export class RankedChallengesComponent implements OnInit {
  private readonly eloRankingService = inject(EloRankingService);

  dataSource = new MatTableDataSource<IncomingMatch>([]);
  displayedColumns = ['date', 'discipline', 'p1', 'p2', 'score', 'diff'];

  async ngOnInit() {
    const matches = await firstValueFrom(this.eloRankingService.GetRankedChallenges(50));
    console.log(matches[0]);
    this.dataSource = new MatTableDataSource(matches.reverse());
  }
}

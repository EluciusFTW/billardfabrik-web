import { Component, OnInit, inject } from '@angular/core';
import { IncomingMatch } from '../../models/ranking-match';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { EloRankingService } from '../../elo-ranking.service';

@Component({
  selector: 'app-ranked-matches',
  templateUrl: './ranked-matches.component.html',
  styleUrls: ['./ranked-matches.component.scss']
})
export class RankedMatchesComponent implements OnInit {
  private readonly eloRankingService = inject(EloRankingService);

  rankingMatches: IncomingMatch[];
  dataSource = new MatTableDataSource<IncomingMatch>();
  includeTourneys = true;
  includeChallenges = true;
  displayedColumns = ['date', 'p1', 'p2', 'score', 'diff'];

  constructor() { }

  ngOnInit(): void {
    this.eloRankingService
      .GetRankedTourneyMatches(200)
      .pipe(take(1))
      .subscribe(matches => {
        this.rankingMatches = matches.reverse();
        this.setDataSource();
      });
  }

  setDataSource() {
    const filteredMatches = this.rankingMatches
      .filter(match =>
        this.includeTourneys && match.source === 'Tourney'
        || this.includeChallenges && match.source === 'Challenge')

    this.dataSource = new MatTableDataSource(filteredMatches);
  }
}

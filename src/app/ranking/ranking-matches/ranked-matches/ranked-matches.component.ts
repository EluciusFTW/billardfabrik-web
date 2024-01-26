import { Component, OnInit } from '@angular/core';
import { IncomingMatch } from '../../models/ranking-match';
import { MatTableDataSource } from '@angular/material/table';
import { EloService } from '../../elo.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-ranked-matches',
  templateUrl: './ranked-matches.component.html',
  styleUrls: ['./ranked-matches.component.scss']
})
export class RankedMatchesComponent implements OnInit {
  rankingMatches: IncomingMatch[];
  dataSource = new MatTableDataSource<IncomingMatch>();
  includeTourneys = true;
  includeChallenges = true;
  displayedColumns = ['date', 'p1', 'p2', 'score', 'diff'];

  constructor(private eloService: EloService) { }

  ngOnInit(): void {
    this.eloService
      .GetRankedMatches(200)
      .pipe(take(1))
      .subscribe(matches => {
        this.rankingMatches = matches
          .map(match => ({
              ... match,
              p1: match.playerOne.name,
              p2: match.playerTwo.name
          }))
          .reverse();
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

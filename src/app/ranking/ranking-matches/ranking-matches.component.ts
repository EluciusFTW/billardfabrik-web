import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EloService } from '../elo.service';
import { firstValueFrom, take } from 'rxjs';
import { TourneyFunctions } from 'src/app/tourney-series/tourney/tourney-functions';
import { Match } from 'src/app/tourney-series/models/match';
import { CompletedMatch, EloFunctions } from 'src/app/tourney-series/services/evaluation/elo-functions';

type RankingMatch = Match & {date: string, diff?: number }

@Component({
  selector: 'app-ranking-matches',
  templateUrl: './ranking-matches.component.html',
  styleUrls: ['./ranking-matches.component.scss']
})
export class RankingMatchesComponent implements OnInit {
  rankingMatches: RankingMatch[];
  dataSource = new MatTableDataSource<Match>();
  displayedColumns = ['date', 'p1', 'p2', 'score'];

  constructor(private eloService: EloService) { }

  ngOnInit(): void {
    this.eloService
      .GetMatches()
      .pipe(take(1))
      .subscribe(
        matches => {
          this.rankingMatches = matches
            .map(m => ({
                date: TourneyFunctions
                  .NameFragmentToDate(m.key.substring(0,8))
                  .toLocaleDateString(),
                ... m}))
            .reverse();
          this.dataSource = new MatTableDataSource(this.rankingMatches);
        }
      )
  }

  async Calculate(): Promise<void> {
    await this.eloService.Calculate();
  }
}


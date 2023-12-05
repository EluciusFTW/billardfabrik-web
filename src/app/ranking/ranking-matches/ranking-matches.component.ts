import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EloService, RankingMatch } from '../elo.service';
import { firstValueFrom, take } from 'rxjs';
import { TourneyFunctions } from 'src/app/tourney-series/tourney/tourney-functions';
import { Match } from 'src/app/tourney-series/models/match';
import { CompletedMatch, EloFunctions } from 'src/app/tourney-series/services/evaluation/elo-functions';

@Component({
  selector: 'app-ranking-matches',
  templateUrl: './ranking-matches.component.html',
  styleUrls: ['./ranking-matches.component.scss']
})
export class RankingMatchesComponent implements OnInit {
  rankingMatches: RankingMatch[];
  dataSource = new MatTableDataSource<RankingMatch>();
  displayedColumns = ['date', 'p1', 'p2', 'score', 'diff'];

  constructor(private eloService: EloService) { }

  ngOnInit(): void {
    this.eloService
      .GetMatches()
      .pipe(take(1))
      .subscribe(
        matches => {
          this.rankingMatches = matches
            .map(m => ({
                ... m,
                p1: m.playerOne.name,
                p2: m.playerTwo.name
            }))
            .reverse();
          this.dataSource = new MatTableDataSource(this.rankingMatches);
        }
      )
  }

  async Calculate(): Promise<void> {
    await this.eloService.Calculate();
  }
}


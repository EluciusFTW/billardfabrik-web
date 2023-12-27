import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EloService } from '../elo.service';
import { IncomingMatch } from '../models/ranking-match';
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
  rankingMatches: IncomingMatch[];
  dataSource = new MatTableDataSource<IncomingMatch>();
  includeTourneys = true;
  includeChallenges = true;
  displayedColumns = ['date', 'p1', 'p2', 'score', 'diff'];

  constructor(private eloService: EloService) { }

  ngOnInit(): void {
    this.eloService
      .GetRankedMatches()
      .pipe(take(1))
      .subscribe(
        matches => {
          this.rankingMatches = matches
            .map(match => ({
                ... match,
                p1: match.playerOne.name,
                p2: match.playerTwo.name
            }))
            .reverse();

          this.setDataSource();
        }
      )
  }

  setDataSource() {
    const filteredMatches = this.rankingMatches
      .filter(match =>
        this.includeTourneys && match.source === 'Tourney'
        || this.includeChallenges && match.source === 'Challenge')

    this.dataSource = new MatTableDataSource(filteredMatches);
  }

  async Calculate(): Promise<void> {
    await this.eloService.UpdateEloScores();
  }
}


import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EloService } from '../elo.service';
import { take } from 'rxjs';
import { TourneyFunctions } from 'src/app/tourney-series/tourney/tourney-functions';

@Component({
  selector: 'app-ranking-matches',
  templateUrl: './ranking-matches.component.html',
  styleUrls: ['./ranking-matches.component.scss']
})
export class RankingMatchesComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns = ['date', 'p1', 'p2', 'score'];

  constructor(private eloService: EloService) { }

  ngOnInit(): void {
    this.eloService.GetMatches()
      .pipe(take(1))
      .subscribe(
        matches => {
          matches.forEach(m => m.date =
            TourneyFunctions
              .NameFragmentToDate(m.key.substring(0,8))
              .toLocaleDateString());
          console.log('Ms: ', matches);
          this.dataSource = new MatTableDataSource(matches.reverse());
        }
      )
  }
}

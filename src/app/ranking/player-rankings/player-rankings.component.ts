import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EloService } from '../elo.service';
import { take, pipe } from 'rxjs';

@Component({
  selector: 'app-player-rankings',
  templateUrl: './player-rankings.component.html',
  styleUrls: ['./player-rankings.component.scss']
})
export class PlayerRankingsComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns = ['place', 'name', 'ranking', 'matches'];

  constructor(private eloService: EloService) { }

  ngOnInit(): void {
    this.eloService.GetRanking()
      .pipe(take(1))
      .subscribe(
        players => {
          let sorted = players.sort((playerOne, playerTwo) => playerTwo.ranking - playerOne.ranking);
          this.dataSource = new MatTableDataSource(sorted);
        }
      )
  }
}

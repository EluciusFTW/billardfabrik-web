import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EloService } from '../elo.service';
import { take, pipe } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PlayerProgressionDialogComponent } from './player-progression-dialog.component';

@Component({
  templateUrl: './player-rankings.component.html',
  styleUrls: ['./player-rankings.component.scss']
})
export class PlayerRankingsComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns = ['place', 'name', 'ranking', 'matches'];

  constructor(private eloService: EloService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.eloService.GetRanking()
      .pipe(take(1))
      .subscribe(
        players => {
          let sorted = players
            .sort((playerOne, playerTwo) => playerTwo.changes[playerTwo.changes.length - 1].eloAfter - playerOne.changes[playerOne.changes.length - 1].eloAfter);
          this.dataSource = new MatTableDataSource(sorted);
        }
      )
  }

  showDetailsOf(player: any) {
    this.dialog.open(PlayerProgressionDialogComponent, {
      data: player,
      width: '80%',
      hasBackdrop: true,
    })
  }
}

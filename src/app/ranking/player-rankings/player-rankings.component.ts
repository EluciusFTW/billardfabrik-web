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

  flatnessBarrier = 6;
  dataSource = new MatTableDataSource<any>();
  displayedColumns = ['place', 'name', 'matches', 'trend', 'max', 'ranking'];

  constructor(private eloService: EloService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.eloService.GetRanking()
      .pipe(take(1))
      .subscribe(
        players => {
          let sorted = players
            .filter(p => p.changes.length >= 11)
            .sort((playerOne, playerTwo) => playerTwo.changes[playerTwo.changes.length - 1].eloAfter - playerOne.changes[playerOne.changes.length - 1].eloAfter)
            .map(player => ({
              ... player,
              max: Math.max(... player.changes.map(c => c.eloAfter)),
              trend: player.changes[player.changes.length - 1].eloAfter - player.changes[player.changes.length - 6].eloAfter
            }));
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

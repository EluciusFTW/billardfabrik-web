import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EloService } from '../elo.service';
import { take, pipe } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PlayerProgressionDialogComponent } from './player-progression-dialog.component';
import { ComputedRankingPlayer } from '../models/ranking-player';

@Component({
  templateUrl: './player-rankings.component.html',
  styleUrls: ['./player-rankings.component.scss']
})
export class PlayerRankingsComponent implements OnInit {

  flatnessBarrier = 6;
  dataSource = new MatTableDataSource<ComputedRankingPlayer>();
  displayedColumns = ['place', 'name', 'matches', 'trend', 'max', 'ranking'];

  constructor(private eloService: EloService, private dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    const players = await this.eloService.GetRanking();

    let sorted = players
      .map(player => ({
        ... player,
        ranking: player.allScores[player.allScores.length - 1],
        matches: player.allScores.length - 1, // -1 bc the initial seed is a score
        max: Math.max(... player.allScores),
        trend: player.allScores[player.allScores.length - 1] - player.allScores[player.allScores.length - 6]
      }))
      .sort((playerOne, playerTwo) => playerTwo.ranking - playerOne.ranking);
    this.dataSource = new MatTableDataSource(sorted);
  }

  showDetailsOf(player: any) {
    this.dialog.open(PlayerProgressionDialogComponent, {
      data: player,
      width: '80%',
      hasBackdrop: true,
    })
  }
}

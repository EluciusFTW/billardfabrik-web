import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EloService } from '../elo.service';
import { take, pipe } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PlayerProgressionDialogComponent } from './player-progression-dialog.component';
import { ComputedRankingPlayer, RankingPlayer } from '../models/ranking-player';
import { EloRankingService } from '../elo-ranking.service';

@Component({
  templateUrl: './player-rankings.component.html',
  styleUrls: ['./player-rankings.component.scss']
})
export class PlayerRankingsComponent implements OnInit {

  flatnessBarrier = 6;
  dataSource = new MatTableDataSource<ComputedRankingPlayer>();
  displayedColumns = ['place', 'name', 'matches', 'trend', 'max', 'ranking'];

  constructor(private eloRankingService: EloRankingService, private dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    const players = await this.eloRankingService.GetCachedRanking();
    let sorted = players.sort((playerOne, playerTwo) => playerTwo.ranking - playerOne.ranking);

    this.dataSource = new MatTableDataSource(sorted);
  }

  showDetailsOf(player: ComputedRankingPlayer) {
    this.dialog.open(PlayerProgressionDialogComponent, {
      data: player,
      width: '80%',
      hasBackdrop: true,
    })
  }

  async UpdateRanking(): Promise<void> {
    this.eloRankingService.UpdateRanking();
  }

  // Once the leaderboard is cached.
  // async showDetailsOf(player: ComputedRankingPlayer) {
  //   this.dialog.open(PlayerProgressionDialogComponent, {
  //     data: this.toComputedPlayer(await this.eloRankingService.GetRankingOf('Guy_Buss')),
  //     width: '80%',
  //     hasBackdrop: true,
  //   })
  // }
}

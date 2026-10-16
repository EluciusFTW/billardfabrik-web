import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { PlayerProgressionDialogComponent } from './player-progression-dialog.component';
import { RankingPlayer } from '../models/ranking-player';
import { EloRankingService } from '../elo-ranking.service';
import { ContentTileComponent } from '../../shared/content-tile/content-tile.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  templateUrl: './player-rankings.component.html',
  styleUrls: ['./player-rankings.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class PlayerRankingsComponent implements OnInit {
  private readonly eloRankingService = inject(EloRankingService);
  private readonly dialog = inject(MatDialog);

  flatnessBarrier = 6;
  dataSource = new MatTableDataSource<RankingPlayer>();
  displayedColumns = ['place', 'name', 'matches', 'trend', 'max', 'ranking'];

  async ngOnInit(): Promise<void> {
    const players = await this.eloRankingService.GetRanking();
    const sorted = players.sort((playerOne, playerTwo) => playerTwo.ranking - playerOne.ranking);
    this.dataSource = new MatTableDataSource(sorted);
  }

  showDetailsOf(player: RankingPlayer) {
    this.dialog.open(PlayerProgressionDialogComponent, {
      data: player,
      width: '80%',
      hasBackdrop: true,
    })
  }
}

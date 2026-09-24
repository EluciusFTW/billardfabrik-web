import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Player } from '../player';
import { PlayersService } from '../players.service';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PlayerCreateDialogComponent } from '../player-create-dialog/player-create-dialog.component';
import { PlayerFunctions } from '../player-functions';
import { ContentTileComponent } from '../../shared/content-tile/content-tile.component';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { PlayerNamePipe } from '../player-name.pipe';

@Component({
  selector: 'app-player-listing',
  templateUrl: './player-listing.component.html',
  styleUrls: ['./player-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent, MatToolbar, MatCheckbox, FormsModule, MatButton, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, PlayerNamePipe]
})
export class PlayerListingComponent {

  private readonly playersService = inject(PlayersService);
  public dialog = inject(MatDialog);

  clubPlayers = true;
  externals = true;

  nrSelected = 0;
  players: Player[];
  get nrTotal() {
    return this.players?.length ?? 0;
  }

  dataSource = new MatTableDataSource<Player>();
  displayedColumns = ['name', 'club', 'showForTourneys', 'showForLeaderboard', 'showForElo'];

  async ngOnInit() {
    this.players = await this.playersService.getPlayers()
    this.setDataSource();
  }

  setDataSource(): void {
    const filteredPlayers = this.players
      .filter(player =>
        this.clubPlayers && player.clubPlayer
        || this.externals && !player.clubPlayer)

    this.nrSelected = filteredPlayers.length;
    this.dataSource = new MatTableDataSource(filteredPlayers);
  }

  addPlayer(): void {
    this.dialog
      .open(PlayerCreateDialogComponent, { data: {} })
      .afterClosed()
      .subscribe(
        result => {
          if (result) {
            const player = result as Player;
            this.playersService.createPlayer(player)
            this.players.push(player);
            this.players.sort(PlayerFunctions.sortPlayers);
            this.setDataSource();
          }});
  }

  async update(player: Player): Promise<void> {
    await this.playersService.updatePlayer(player);
  }
}

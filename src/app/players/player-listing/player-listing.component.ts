import { Component, inject } from '@angular/core';
import { Player } from '../player';
import { PlayersService } from '../players.service';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PlayerCreateDialogComponent } from '../player-create-dialog/player-create-dialog.component';
import { PlayerFunctions } from '../player-functions';

@Component({
  selector: 'app-player-listing',
  templateUrl: './player-listing.component.html',
  styleUrls: ['./player-listing.component.scss']
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

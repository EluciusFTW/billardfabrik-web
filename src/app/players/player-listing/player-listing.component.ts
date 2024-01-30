import { Component, inject } from '@angular/core';
import { Player } from '../player';
import { PlayersService } from '../players.service';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { Db } from 'src/app/shared/firebase-utilities';

@Component({
  selector: 'app-player-listing',
  templateUrl: './player-listing.component.html',
  styleUrls: ['./player-listing.component.scss']
})
export class PlayerListingComponent {

  private readonly playersService = inject(PlayersService);

  players: Player[];
  dataSource = new MatTableDataSource<Player>();
  displayedColumns = ['name', 'club', 'showForTourneys', 'showForElo'];

  ngOnInit(): void {
    this.playersService
      .getPlayers()
      .pipe(take(1))
      .subscribe(players => {
        this.players = players
        this.dataSource = new MatTableDataSource<Player>(players);
      });
  }

  update(player: Player): void {
    this.playersService.updatePlayer(player);
  }

  setp(): void {
    this.playersService.setp();
  }
}

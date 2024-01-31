import { Component, inject } from '@angular/core';
import { Player } from '../player';
import { PlayersService } from '../players.service';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';

@Component({
  selector: 'app-player-listing',
  templateUrl: './player-listing.component.html',
  styleUrls: ['./player-listing.component.scss']
})
export class PlayerListingComponent {

  private readonly playersService = inject(PlayersService);

  clubPlayers = true;
  externals = true;

  nrSelected = 0;
  nrTotal = 0;

  players: Player[];
  dataSource = new MatTableDataSource<Player>();
  displayedColumns = ['name', 'club', 'showForTourneys', 'showForLeaderboard', 'showForElo'];

  ngOnInit(): void {
    this.playersService
      .getPlayers()
      .pipe(take(1))
      .subscribe(players => {
        this.players = players
        this.nrTotal = players.length;
        this.setDataSource();
      });
  }


  setDataSource(): void {
    const filteredMatches = this.players
      .filter(match =>
        this.clubPlayers && match.clubPlayer
        || this.externals && !match.clubPlayer)

    this.nrSelected = filteredMatches.length;
    this.dataSource = new MatTableDataSource(filteredMatches);
  }

  update(player: Player): void {
    this.playersService.updatePlayer(player);
  }

  setp(): void {
    this.playersService.setp();
  }
}

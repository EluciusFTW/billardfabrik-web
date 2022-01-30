import { Component } from '@angular/core';
import { PlayersService } from '../services/players.service';
import { Subscription } from 'rxjs';
import { TourneyPlayer } from '../models/tourney-player';

@Component({
  selector: 'app-tourney-players',
  templateUrl: './tourney-players.component.html',
  styleUrls: ['./tourney-players.component.scss']
})
export class TourneyPlayersComponent {

  // private playerSub: Subscription;
  // players: TourneyPlayer[];

  // constructor(private playersService: PlayersService) {

  //   this.playerSub = this.playersService.getAll().subscribe(
  //     players => {
  //       this.players = players;
  //     },
  //     // e => this.messageService.failure('Fehler', 'Wir konnten leider nicht zum news-feed verbinden. Bitte versuchen Sie die Seite erneut zu laden.')
  //   );
  // }
}

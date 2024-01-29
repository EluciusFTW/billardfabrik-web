import { Injectable, inject } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { OwnMessageService } from 'src/app/shared/services/own-message.service';
import { PlayerFunctions } from 'src/app/players/player-functions';
import { Player } from 'src/app/players/player';
import { Db, withoutKey } from '../shared/firebase-utilities';

const DB_PLAYERS_LPATH = 'players';

@Injectable()
export class PlayersService {
  private readonly db = inject(AngularFireDatabase);
  private readonly messageService = inject(OwnMessageService);

  updatePlayer(item: Db<Player>): void {
    this.db
      .list(DB_PLAYERS_LPATH)
      .update(item.key, withoutKey(item))
      .then(
        _ => this.messageService.success('Spieler erfolgreich aktualisiert!'),
        _ => this.messageService.failure('Fehler beim Aktualisieren des Spielers :/'));;
  }

  createPlayer(player: Player): void {
    this.db
      .object(DB_PLAYERS_LPATH + '/' + PlayerFunctions.keyFromPlayer(player))
      .set(player)
      .then(
        _ => this.messageService.success('Spieler erfolgreich hinzugefügt!'),
        _ => this.messageService.failure('Fehler beim Speichern des Spielers :/'));
  }
}

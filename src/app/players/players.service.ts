import { Injectable, inject } from '@angular/core';
import { OwnMessageService } from 'src/app/shared/services/own-message.service';
import { PlayerFunctions } from 'src/app/players/player-functions';
import { Player } from 'src/app/players/player';
import { Observable, firstValueFrom, map } from 'rxjs';
import { FirebaseService } from '../shared/firebase.service';

const DB_PLAYERS_LPATH = 'players';

@Injectable()
export class PlayersService extends FirebaseService {
  private readonly messageService = inject(OwnMessageService);

  getPlayers(): Promise<Player[]> {
    return firstValueFrom(
      this.db
        .list<Player>(DB_PLAYERS_LPATH)
        .valueChanges())
  }

  getEloPlayers(): Promise<Player[]> {
    return firstValueFrom(
      this.db
        .list<Player>(DB_PLAYERS_LPATH, ref => ref
          .orderByChild('clubPlayer')
          .equalTo(true))
        .valueChanges()
        .pipe(map(ps => ps.filter(p => p.showForElo))));
  }

  getTourneyPlayers(): Promise<Player[]> {
    return firstValueFrom(
      this.db
        .list<Player>(DB_PLAYERS_LPATH, ref => ref
          .orderByChild('showForTourneys')
          .equalTo(true))
        .valueChanges());
  }

  getLeaderBoardPlayers(): Observable<Player[]> {
    return this.db
      .list<Player>(DB_PLAYERS_LPATH, ref => ref
        .orderByChild('showForLeaderboard')
        .equalTo(true))
      .valueChanges()
  }

  updatePlayer(player: Player): Promise<void> {
    let key = PlayerFunctions.keyFromPlayer(player);

    return this.db
      .list(DB_PLAYERS_LPATH)
      .update(key, player)
      .then(
        _ => this.messageService.success('Spieler erfolgreich aktualisiert!'),
        _ => this.messageService.failure('Fehler beim Aktualisieren des Spielers :/'));;
  }

  createPlayer(player: Player): Promise<void> {
    return this.db
      .object(DB_PLAYERS_LPATH + '/' + PlayerFunctions.keyFromPlayer(player))
      .set(player)
      .then(
        _ => this.messageService.success('Spieler erfolgreich hinzugefügt!'),
        _ => this.messageService.failure('Fehler beim Speichern des Spielers :/'));
  }
}

import { Injectable, inject } from '@angular/core';
import { OwnMessageService } from 'src/app/shared/services/own-message.service';
import { PlayerFunctions } from 'src/app/players/player-functions';
import { Player } from 'src/app/players/player';
import { Observable, firstValueFrom, map } from 'rxjs';
import { FirebaseService } from '../shared/firebase.service';
import { ref, listVal, query, orderByChild, equalTo, update, set } from '@angular/fire/database';

const DB_PLAYERS_LPATH = 'players';

@Injectable()
export class PlayersService extends FirebaseService {
  private readonly messageService = inject(OwnMessageService);
  private readonly playersRef = ref(this.db, 'players');

  getPlayers(): Promise<Player[]> {
    return firstValueFrom(listVal<Player>(this.playersRef));
  }

  getEloPlayers(): Promise<Player[]> {
    const eloQuery = query(
      this.playersRef,
      orderByChild('clubPlayer'),
      equalTo(true)
    );

    return firstValueFrom(
      listVal<Player>(eloQuery).pipe(
        map(ps => ps.filter(p => p.showForElo))
      )
    );
  }

  getTourneyPlayers(): Promise<Player[]> {
    const q = query(
      this.playersRef,
      orderByChild('showForTourneys'),
      equalTo(true)
    );

    return firstValueFrom(
      listVal<Player>(q).pipe(
        map(ps => ps.filter(p => p.showForElo))
      )
    );
  }

  getLeaderBoardPlayers(): Observable<Player[]> {
    const q = query(
      this.playersRef,
      orderByChild('showForLeaderboard'),
      equalTo(true)
    );

    return listVal<Player>(q);
  }

  async updatePlayer(player: Player): Promise<void> {
    let key = PlayerFunctions.keyFromPlayer(player);
    const playerRef = ref(this.db, `${DB_PLAYERS_LPATH}/${key}`);

    return update(playerRef, player)
      .then(
        _ => this.messageService.success('Spieler erfolgreich aktualisiert!'),
        _ => this.messageService.failure('Fehler beim Aktualisieren des Spielers :/'));;
  }

  async createPlayer(player: Player): Promise<void> {
    const playerRef = ref(this.db, `${DB_PLAYERS_LPATH}/${PlayerFunctions.keyFromPlayer(player)}`);

    return set(playerRef, player)
      .then(
        _ => this.messageService.success('Spieler erfolgreich hinzugefügt!'),
        _ => this.messageService.failure('Fehler beim Speichern des Spielers :/'));
  }
}

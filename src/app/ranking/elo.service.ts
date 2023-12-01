import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, map } from 'rxjs';

const DB_MATCHES_LPATH = 'elo/matches';
const DB_PLAYERS_PATH = 'elo/players';

@Injectable()
export class EloService {

  constructor(private db: AngularFireDatabase) { }

  GetRanking(): Observable<EloPlayer[]> {
    return this.db
      .list<EloPlayer>(DB_PLAYERS_PATH)
      .snapshotChanges()
      .pipe(map(snapshots => snapshots
        .map(item => item.payload)
        .map(player => ({ name: this.nameFromKey(player.key), matches: player.val().changes?.size || 0, ...player.val()}))));
  }

  private nameFromKey(name: string): string {
    return name.replace('_', ' ');
  }
}

interface EloPlayer {
  name: string;
  ranking: number;
  changes: Map<string, number>;
}

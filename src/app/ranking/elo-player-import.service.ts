import { Injectable, inject } from "@angular/core";
import { FirebaseService } from "../shared/firebase.service";
import { EloFunctions } from "./elo-functions";
import { DB_NEW_PLAYERS_PATH } from "./elo.service";
import { PlayerFunctions } from "../players/player-functions";
import { firstValueFrom, map } from "rxjs";
import { PlayersService } from "../players/players.service";
import { EloPlayerData } from "./models/elo-models";

@Injectable()
export class EloPlayerImportService extends FirebaseService {
  private readonly playersService = inject(PlayersService);

  public async ImportPlayers(): Promise<void[]> {
    let existingPlayerKeys = await firstValueFrom(
      this.db
        .list<EloPlayerData>(DB_NEW_PLAYERS_PATH)
        .snapshotChanges()
        .pipe(map(c => c.map(k => k.key))));

    let allPlayerKeys = await firstValueFrom(
      this.playersService
        .getPlayers()
        .pipe(map(ps => ps.map(p => PlayerFunctions.keyFromPlayer(p)))));

    let inserts = allPlayerKeys
      .filter(playerKey => !existingPlayerKeys.includes(playerKey))
      .map(
        async player => await this.db
          .object(`${DB_NEW_PLAYERS_PATH}/${PlayerFunctions.keyFromName(player)}`)
          .set(this.initialPlayer())
        );

    return await Promise.all(inserts);
  }

  private initialPlayer(): EloPlayerData {
    return {
      show: true,
      changes: [{
        match: '__InitialSeed__',
        cla: EloFunctions.InitialValue,
        bvf: EloFunctions.InitialValue,
        wwb: EloFunctions.InitialValue,
        wnb: EloFunctions.InitialValue,
      }],
    }
  }
}

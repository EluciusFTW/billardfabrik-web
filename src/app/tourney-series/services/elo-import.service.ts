import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Tourney } from '../models/tourney';
import { TourneyFunctions } from '../tourney/tourney-functions';
import { firstValueFrom, map } from 'rxjs';
import { MatchStatus } from '../models/match-status';

const DB_MATCHES_LPATH = 'elo/matches';
const DB_PLAYERS_PATH = 'elo/players';

@Injectable()
export class EloImportService {

  constructor(private db: AngularFireDatabase) { }

  async ImportMatches(tourney: Tourney): Promise<void> {
    let groupMatches = tourney.groups?.flatMap(group => group.matches) || [];
    let doubleEliminationMatches = tourney.doubleEliminationStages?.flatMap(stage => stage.matches) || [];
    let singleeEliminationMatches = tourney.eliminationStages?.flatMap(stage => stage.matches) || [];

    groupMatches
      .concat(doubleEliminationMatches)
      .concat(singleeEliminationMatches)
      .filter(match => match.status === MatchStatus.done)
      .forEach(async (match, index) => await this.db
        .object(`${DB_MATCHES_LPATH}/${tourney.meta.date}-T-${index.toString().padStart(4, '0')}`)
        .set(match));
  }

  public async ImportPlayers(tourney: Tourney): Promise<void> {
    let players = TourneyFunctions.GetPlayers(tourney);
    let existingPlayers = await firstValueFrom(
      this.db
        .list<EloPlayer>(DB_PLAYERS_PATH)
        .snapshotChanges()
        .pipe(map(c => c.map(k => k.key))))

    return players
      .map(player => this.keyFromName(player))
      .filter(playerKey => !existingPlayers.includes(playerKey))
      .forEach(player => this.db
        .object(`${DB_PLAYERS_PATH}/${this.keyFromName(player)}`)
        .set(this.initialPlayer()));
  }

  private initialPlayer(): EloPlayer {
    return {
      changes: [{match: '__InitialSeed__', eloAfter: 1200}],
    }
  }

  private keyFromName(name: string): string {
    return name.replace(' ', '_');
  }
}

interface EloPlayer {
  changes: EloDataPoint[];
}

interface EloDataPoint {
  match: string,
  eloAfter: number
}

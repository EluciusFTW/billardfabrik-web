import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Tourney } from '../tourney-series/models/tourney';
import { TourneyFunctions } from '../tourney-series/tourney/tourney-functions';
import { firstValueFrom, map } from 'rxjs';
import { MatchStatus } from '../tourney-series/models/match-status';
import { EloFunctions } from '../tourney-series/services/evaluation/elo-functions';
import { IncomingMatch } from './models/ranking-match';
import { Match } from '../tourney-series/models/match';
import { MatchPlayer } from '../tourney-series/models/match-player';

const DB_INCOMING_MATCHES_LPATH = 'elo/incomingmatches';
const DB_PLAYERS_PATH = 'elo/players';

@Injectable()
export class EloImportService {

  constructor(private db: AngularFireDatabase) { }

  async ImportMatches(tourney: Tourney): Promise<IncomingMatch[]> {
    let groupMatches = tourney.groups?.flatMap(group => group.matches) || [];
    let doubleEliminationMatches = tourney.doubleEliminationStages?.flatMap(stage => stage.matches) || [];
    let singleEliminationMatches = tourney.eliminationStages?.flatMap(stage => stage.matches) || [];

    let allMatches = groupMatches
      .concat(doubleEliminationMatches)
      .concat(singleEliminationMatches)
      .filter(match => match.status === MatchStatus.done)
      .filter(match => MatchPlayer.isReal(match.playerOne))
      .filter(match => MatchPlayer.isReal(match.playerTwo))
      .map(match => this.toRankingMatch(match, tourney.meta.date!));

    allMatches.forEach(
      async (match, index) => {
        console.log('Importing match: ', match);
        await this.db
        .object(`${DB_INCOMING_MATCHES_LPATH}/${tourney.meta.date}-T-${index.toString().padStart(4, '0')}`)
        .update(match)
      });

    return allMatches;
  }

  private toRankingMatch(match: Match, date: string): IncomingMatch {
    return {
      date: date,
      source: 'Tourney',
      ... match
    }
  }

  public async ImportPlayers(tourney: Tourney): Promise<string[]> {
    let players = TourneyFunctions.GetPlayers(tourney);
    let existingPlayers = await firstValueFrom(
      this.db
        .list<EloPlayer>(DB_PLAYERS_PATH)
        .snapshotChanges()
        .pipe(map(c => c.map(k => k.key))))

    let newPlayers = players
      .map(player => this.keyFromName(player))
      .filter(playerKey => !existingPlayers.includes(playerKey));

    newPlayers.forEach(
      async player => await this.db
        .object(`${DB_PLAYERS_PATH}/${this.keyFromName(player)}`)
        .set(this.initialPlayer())
      );

    return newPlayers;
  }

  private initialPlayer(): EloPlayer {
    return {
      show: true,
      changes: [{ match: '__InitialSeed__', eloAfter: EloFunctions.InitialValue }],
    }
  }

  private keyFromName(name: string): string {
    return name.replace(' ', '_');
  }
}

interface EloPlayer {
  show: boolean
  changes: EloDataPoint[];
}

interface EloDataPoint {
  match: string,
  eloAfter: number
}

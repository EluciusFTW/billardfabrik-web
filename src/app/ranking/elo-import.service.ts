import { Injectable } from '@angular/core';
import { Tourney } from '../tourney-series/models/tourney';
import { TourneyFunctions } from '../tourney-series/tourney/tourney-functions';
import { firstValueFrom, map } from 'rxjs';
import { MatchStatus } from '../tourney-series/models/match-status';
import { EloFunctions } from './elo-functions';
import { IncomingMatch, IncomingTourneyMatch } from './models/ranking-match';
import { Match } from '../tourney-series/models/match';
import { MatchPlayer } from '../tourney-series/models/match-player';
import { DB_INCOMING_TOURNEY_MATCHES_LPATH, DB_NEW_PLAYERS_PATH } from './elo.service';
import { EloPlayerData } from './models/elo-models';
import { PlayerFunctions } from '../players/player-functions';
import { FirebaseService } from '../shared/firebase.service';

@Injectable()
export class EloImportService extends FirebaseService {

  async ImportMatches(tourney: Tourney): Promise<IncomingMatch[]> {
    let groupMatches = tourney.groups?.flatMap(group => group.matches) || [];
    let doubleEliminationMatches = tourney.doubleEliminationStages?.flatMap(stage => stage.matches) || [];
    let singleEliminationMatches = tourney.eliminationStages?.flatMap(stage => stage.matches) || [];

    let allMatches = groupMatches
      .concat(doubleEliminationMatches)
      .concat(singleEliminationMatches)
      .filter(match => match.status === MatchStatus.done)
      .filter(match => match.length >= 3)
      .filter(match => MatchPlayer.isReal(match.playerOne))
      .filter(match => MatchPlayer.isReal(match.playerTwo))
      .map(match => this.toIncomingTourneyMatch(match, tourney.meta.date!));

    allMatches
      .forEach(async (match, index) => {
        await this.db
          .object(this.tourneyMatchPath(match, index))
          .update(match)
      });

    return allMatches;
  }

  private tourneyMatchPath(match: IncomingTourneyMatch, index: number): string {
    return `${DB_INCOMING_TOURNEY_MATCHES_LPATH}/${match.date}-T-${index.toString().padStart(4, '0')}`;
  }

  private toIncomingTourneyMatch(match: Match, date: string): IncomingTourneyMatch {
    const { status, ...rest } = match;
    return {
      date: date,
      source: 'Tourney',
      ... rest
    }
  }

  public async ImportPlayers(tourney: Tourney): Promise<string[]> {
    let players = TourneyFunctions.GetPlayers(tourney);
    let existingPlayers = await firstValueFrom(
      this.db
        .list<EloPlayerData>(DB_NEW_PLAYERS_PATH)
        .snapshotChanges()
        .pipe(map(c => c.map(k => k.key))))

    let newPlayers = players
      .map(player => PlayerFunctions.keyFromName(player))
      .filter(playerKey => !existingPlayers.includes(playerKey));

    newPlayers.forEach(
      async player => await this.db
        .object(`${DB_NEW_PLAYERS_PATH}/${PlayerFunctions.keyFromName(player)}`)
        .set(this.initialPlayer())
      );

    return newPlayers;
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

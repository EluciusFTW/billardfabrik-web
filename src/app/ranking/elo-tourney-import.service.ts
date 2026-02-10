import { Injectable, inject } from '@angular/core';
import { Tourney } from '../tourney-series/models/tourney';
import { MatchStatus } from '../tourney-series/models/match-status';
import { IncomingMatch, IncomingTourneyMatch, ScoredMatch } from './models/ranking-match';
import { Match } from '../tourney-series/models/match';
import { MatchPlayer } from '../tourney-series/models/match-player';
import { DB_INCOMING_TOURNEY_MATCHES_LPATH, DB_MATCHES_LPATH } from './elo.service';
import { FirebaseService } from '../shared/firebase.service';
import { firstValueFrom, map } from 'rxjs';
import { OwnMessageService } from '../shared/services/own-message.service';
import { DatabaseReference, equalTo, get, limitToLast, listVal, orderByChild, query, ref, update } from '@angular/fire/database';
import { listValWithKey } from '../shared/firebase-utilities';

@Injectable()
export class EloTourneyImportService extends FirebaseService {
  private readonly messager = inject(OwnMessageService);

  async ImportTourney(tourney: Tourney): Promise<IncomingMatch[]> {
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
        await update(this.tourneyMatchRef(match, index), match)
          .then(
            _ => { },
            error => this.messager.failure(`Fehler beim importieren: ${error}.`)
          );
      });

    return allMatches;
  }

  private tourneyMatchRef(match: IncomingTourneyMatch, index: number): DatabaseReference {
    return ref(this.db, `${DB_INCOMING_TOURNEY_MATCHES_LPATH}/${match.date}-T-${index.toString().padStart(4, '0')}`);
  }

  private toIncomingTourneyMatch(match: Match, date: string): IncomingTourneyMatch {
    const { status, ...rest } = match;
    return {
      date: date,
      source: 'Tourney',
      ...rest
    }
  }

  async GetLastTourneyDate(): Promise<string> {
    const lastRanked = await firstValueFrom(
      listValWithKey<ScoredMatch>(this.LastTourneyMatchQuery(ref(this.db, DB_MATCHES_LPATH)))
        .pipe(map(item => item[0].key.substring(0, 8))));
    const lastImported = await firstValueFrom(
      listValWithKey<IncomingMatch>(this.LastTourneyMatchQuery(ref(this.db, DB_INCOMING_TOURNEY_MATCHES_LPATH)))
        .pipe(map(item => item[0].key.substring(0, 8))));

    return [lastImported, lastRanked].sort()[0];
  }

  private LastTourneyMatchQuery(ref: DatabaseReference) {
    return query(ref,
      orderByChild('source'),
      equalTo('Tourney'),
      limitToLast(1));
  }
}

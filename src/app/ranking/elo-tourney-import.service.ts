import { Service, inject } from '@angular/core';
import { Tourney } from '../tourney-series/models/tourney';
import { MatchStatus } from '../tourney-series/models/match-status';
import { IncomingMatch, IncomingTourneyMatch, ScoredMatch } from './models/ranking-match';
import { Match } from '../tourney-series/models/match';
import { MatchPlayer } from '../tourney-series/models/match-player';
import { DB_INCOMING_TOURNEY_MATCHES_LPATH, DB_MATCHES_LPATH } from './elo.service';
import { FirebaseService } from '../shared/firebase.service';
import { firstValueFrom, map } from 'rxjs';
import { OwnMessageService } from '../shared/services/own-message.service';
import { DatabaseReference, equalTo, limitToLast, orderByChild, query, ref, update } from '@angular/fire/database';
import { listValWithKey } from '../shared/firebase-utilities';

@Service()
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
      .map(match => this.toIncomingTourneyMatch(match, tourney));

    await Promise.all(allMatches
      .map((match, index) => update(this.tourneyMatchRef(tourney, match, index), match)
        .then(
          _ => {},
          error => this.messager.failure(`Fehler beim importieren: ${error}.`)
        )));

    return allMatches;
  }

  // Unique tourneys can share a date with a series tourney (or with each other),
  // so their match keys are based on the tourney's own key instead.
  private tourneyMatchRef(tourney: Tourney, match: IncomingTourneyMatch, index: number): DatabaseReference {
    const nr = index.toString().padStart(4, '0');
    return tourney.meta.unique
      ? ref(this.db, `${DB_INCOMING_TOURNEY_MATCHES_LPATH}/${(<any>tourney).key}-U-${nr}`)
      : ref(this.db, `${DB_INCOMING_TOURNEY_MATCHES_LPATH}/${match.date}-T-${nr}`);
  }

  private toIncomingTourneyMatch(match: Match, tourney: Tourney): IncomingTourneyMatch {
    const { status, ...rest } = match;
    return {
      date: tourney.meta.date!,
      source: tourney.meta.unique ? 'UniqueTourney' : 'Tourney',
      ... rest
    }
  }

  async GetLastTourneyDate(): Promise<string> {
    const lastRanked = await firstValueFrom(
      listValWithKey<ScoredMatch>(this.LastTourneyMatch(DB_MATCHES_LPATH))
        .pipe(map(matches => matches.map(item => item.key.substring(0,8))[0])));

    const lastImported = await firstValueFrom(
      listValWithKey<IncomingMatch>(this.LastTourneyMatch(DB_INCOMING_TOURNEY_MATCHES_LPATH))
        .pipe(map(matches => matches.map(item => item.key.substring(0,8))[0])));

    return [lastImported, lastRanked].sort()[0];
  }

  private LastTourneyMatch(path: string) {
    return query(
      ref(this.db, path),
      orderByChild('source'),
      equalTo('Tourney'),
      limitToLast(1));
  }
}

import { Injectable, inject } from '@angular/core';
import { Tourney } from '../tourney-series/models/tourney';
import { MatchStatus } from '../tourney-series/models/match-status';
import { IncomingMatch, IncomingTourneyMatch, ScoredMatch } from './models/ranking-match';
import { Match } from '../tourney-series/models/match';
import { MatchPlayer } from '../tourney-series/models/match-player';
import { DB_INCOMING_TOURNEY_MATCHES_LPATH, DB_MATCHES_LPATH } from './elo.service';
import { FirebaseService } from '../shared/firebase.service';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class EloTourneyImportService extends FirebaseService {

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

  async GetLastTourneyDate(): Promise<string> {
    const lastRanked = await firstValueFrom(
      this.db
        .list<ScoredMatch>(DB_MATCHES_LPATH, this.LastTourneyMatch())
        .snapshotChanges()
        .pipe(map(snapshots => snapshots.map(item => item.key.substring(0,8))[0]))
    )

    const lastImported = firstValueFrom(
      this.db
        .list<IncomingMatch>(DB_INCOMING_TOURNEY_MATCHES_LPATH, this.LastTourneyMatch())
        .snapshotChanges()
        .pipe(map(snapshots => snapshots.map(item => item.key.substring(0,8))[0]))
    )

    return [lastImported, lastRanked].sort()[0];
  }

  private LastTourneyMatch() {
    return ref => ref
      .orderByChild('source')
      .equalTo('Tourney')
      .limitToLast(1);
  }
}

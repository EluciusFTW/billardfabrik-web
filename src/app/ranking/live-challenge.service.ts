import { Service, inject } from '@angular/core';
import { push, ref, remove, update } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Db, listValWithKey } from '../shared/firebase-utilities';
import { FirebaseService } from '../shared/firebase.service';
import { OwnMessageService } from '../shared/services/own-message.service';
import { Match } from '../tourney-series/models/match';
import { TourneyFunctions } from '../tourney-series/tourney/tourney-functions';
import { EloChallengeImportService } from './elo-challenge-import.service';
import { LiveChallenge } from './models/live-challenge';
import { IncomingChallengeMatch } from './models/ranking-match';

const DB_LIVE_CHALLENGES_LPATH = 'liveChallenges';

@Service()
export class LiveChallengeService extends FirebaseService {
  private readonly importService = inject(EloChallengeImportService);
  private readonly messager = inject(OwnMessageService);
  private readonly challengesRef = ref(this.db, DB_LIVE_CHALLENGES_LPATH);

  getAll(): Observable<Db<LiveChallenge>[]> {
    return listValWithKey<LiveChallenge>(this.challengesRef);
  }

  create(challenge: LiveChallenge): Promise<void> {
    return push(this.challengesRef, challenge)
      .then(
        _ => this.messager.success('Challenge gestartet!'),
        _ => this.messager.failure('Die Challenge konnte nicht gestartet werden.'));
  }

  updateScore(challenge: Db<LiveChallenge>): Promise<void> {
    return update(this.challengeRef(challenge.key), {
      'playerOne/points': challenge.playerOne.points,
      'playerTwo/points': challenge.playerTwo.points
    });
  }

  abandon(challenge: Db<LiveChallenge>): Promise<void> {
    return remove(this.challengeRef(challenge.key))
      .then(
        _ => this.messager.success('Challenge abgebrochen.'),
        _ => this.messager.failure('Die Challenge konnte nicht abgebrochen werden.'));
  }

  async complete(challenge: Db<LiveChallenge>): Promise<void> {
    if (!Match.isOver(challenge)) {
      return;
    }

    const match: IncomingChallengeMatch = {
      playerOne: { ...challenge.playerOne },
      playerTwo: { ...challenge.playerTwo },
      discipline: challenge.discipline,
      length: challenge.length,
      date: TourneyFunctions.DateToNameFragment(new Date()),
      source: 'Challenge'
    };

    // Only drop the live challenge if the import worked, otherwise the result would be lost.
    if (await this.importService.Import(match)) {
      await remove(this.challengeRef(challenge.key));
    }
  }

  private challengeRef(key: string) {
    return ref(this.db, `${DB_LIVE_CHALLENGES_LPATH}/${key}`);
  }
}

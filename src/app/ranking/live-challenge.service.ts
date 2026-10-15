import { Service, inject } from '@angular/core';
import { object, push, ref, remove, update } from '@angular/fire/database';
import { Observable, map } from 'rxjs';
import { Db, listValWithKey, unpackSnapshotWithKey } from '../shared/firebase-utilities';
import { FirebaseService } from '../shared/firebase.service';
import { OwnMessageService } from '../shared/services/own-message.service';
import { StraightPool } from '../tourney-series/models/straight-pool';
import { TourneyFunctions } from '../tourney-series/tourney/tourney-functions';
import { EloChallengeImportService } from './elo-challenge-import.service';
import { LiveChallenge, RackChallenge, StraightPoolChallenge } from './models/live-challenge';
import { IncomingChallengeMatch } from './models/ranking-match';
import { StraightPoolInning, evaluateScoresheet } from './straight-pool-scoresheet';

const DB_LIVE_CHALLENGES_LPATH = 'liveChallenges';

@Service()
export class LiveChallengeService extends FirebaseService {
  private readonly importService = inject(EloChallengeImportService);
  private readonly messager = inject(OwnMessageService);
  private readonly challengesRef = ref(this.db, DB_LIVE_CHALLENGES_LPATH);

  getAll(): Observable<Db<LiveChallenge>[]> {
    return listValWithKey<StoredLiveChallenge>(this.challengesRef).pipe(
      map(challenges => challenges.map(fromDb)));
  }

  // Emits null once the challenge is gone, i.e. completed or abandoned.
  get(key: string): Observable<Db<LiveChallenge> | null> {
    return object(this.challengeRef(key)).pipe(
      map(change => change.snapshot.exists() ? fromDb(unpackSnapshotWithKey<StoredLiveChallenge>(change)) : null));
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

  addInning(challenge: Db<StraightPoolChallenge>, inning: StraightPoolInning): Promise<void> {
    return this.saveInnings(challenge, [...challenge.innings, inning]);
  }

  removeLastInning(challenge: Db<StraightPoolChallenge>): Promise<void> {
    return this.saveInnings(challenge, challenge.innings.slice(0, -1));
  }

  private saveInnings(challenge: Db<StraightPoolChallenge>, innings: StraightPoolInning[]): Promise<void> {
    const sheet = evaluateScoresheet(innings, challenge.inningLimit);
    return update(this.challengeRef(challenge.key), {
      innings,
      'playerOne/points': sheet.one.total,
      'playerTwo/points': sheet.two.total
    }).catch(_ => this.messager.failure('Die Aufnahme konnte nicht gespeichert werden.'));
  }

  abandon(challenge: Db<LiveChallenge>): Promise<void> {
    return remove(this.challengeRef(challenge.key))
      .then(
        _ => this.messager.success('Challenge abgebrochen.'),
        _ => this.messager.failure('Die Challenge konnte nicht abgebrochen werden.'));
  }

  async complete(challenge: Db<LiveChallenge>): Promise<void> {
    if (!LiveChallenge.isOver(challenge)) {
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

// A 14/1 challenge as it comes back from Firebase: empty arrays are not stored, so there are no
// innings before the first one is played.
type StoredStraightPoolChallenge = Omit<StraightPoolChallenge, 'innings'> & {
  innings?: StraightPoolInning[];
};
type StoredLiveChallenge = RackChallenge | StoredStraightPoolChallenge;

function fromDb(challenge: Db<StoredLiveChallenge>): Db<LiveChallenge> {
  if (challenge.discipline !== StraightPool.discipline) {
    return challenge;
  }

  return { ...challenge, innings: challenge.innings ?? [] };
}

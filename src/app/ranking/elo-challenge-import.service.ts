import { Injectable } from '@angular/core';
import { IncomingChallengeMatch } from './models/ranking-match';
import { DB_INCOMING_CHALLENGE_MATCHES_LPATH } from './elo.service';
import { FirebaseService } from '../shared/firebase.service';

const CHALLENGES_PATH = 'challenges';

@Injectable()
export class EloChallengeImportService extends FirebaseService {

  private async challengeMatchPath(match: IncomingChallengeMatch): Promise<string> {
    const matchref = await this.db
      .list(DB_INCOMING_CHALLENGE_MATCHES_LPATH)
      .push({});

    return this.buildKey(matchref.key, match.date);
  }

  private buildKey(originalKey: string, dateString: string): string {
    return `${dateString}-C${originalKey}`.slice(0, originalKey.length);
  }

  async Import(match: IncomingChallengeMatch): Promise<void> {
    const newKey = await this.challengeMatchPath(match);
    await this.db
      .object(`${CHALLENGES_PATH}/${newKey}`)
      .set(match);

    await this.db
      .object(`${DB_INCOMING_CHALLENGE_MATCHES_LPATH}/${newKey}`)
      .set(match);
  }
}

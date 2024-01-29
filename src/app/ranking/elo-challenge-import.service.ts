import { Injectable } from '@angular/core';
import { IncomingChallengeMatch } from './models/ranking-match';
import { DB_INCOMING_CHALLENGE_MATCHES_LPATH } from './elo.service';
import { FirebaseService } from '../shared/firebase.service';

@Injectable()
export class EloChallengeImportService extends FirebaseService {

  private async challengeMatchPath(match: IncomingChallengeMatch): Promise<string> {
    const matchref = await this.db
      .list(DB_INCOMING_CHALLENGE_MATCHES_LPATH)
      .push({});

    const newKey = this.buildKey(matchref.key, match.date);
    return `${DB_INCOMING_CHALLENGE_MATCHES_LPATH}/${newKey}`;
  }

  private buildKey(originalKey: string, dateString: string): string {
    return `${dateString}-C${originalKey}`.slice(0, originalKey.length);
  }

  async ImportSingleMatch(match: IncomingChallengeMatch): Promise<void> {
    await this.db
      .object(await this.challengeMatchPath(match))
      .set(match);
  }
}

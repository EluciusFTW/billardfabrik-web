import { Injectable, inject } from '@angular/core';
import { IncomingChallengeMatch } from './models/ranking-match';
import { DB_INCOMING_CHALLENGE_MATCHES_LPATH } from './elo.service';
import { FirebaseService } from '../shared/firebase.service';
import { MatchPlayer } from '../tourney-series/models/match-player';
import { OwnMessageService } from '../shared/services/own-message.service';

const CHALLENGES_PATH = 'challenges';

@Injectable()
export class EloChallengeImportService extends FirebaseService {

  private readonly messager = inject(OwnMessageService);

  private async challengeMatchPath(match: IncomingChallengeMatch): Promise<string> {
    return `${match.date}-C-${this.getInfo(match.playerOne)}${this.getInfo(match.playerTwo)}${this.discpilineInfo(match)}`
  }

  private discpilineInfo(match: IncomingChallengeMatch) {
    switch(match.discipline){
      case '8-Ball': return 'A';
      case '9-Ball': return 'N';
      case '10-Ball': return 'T';
      case 'One-Pocket': return '0';
      case '14/1': return 'S';
      case 'Bank-Pool': return 'B';
    }
  }

  private getInfo(player: MatchPlayer): string {
    const parts = player.name.split(' ');
    return (parts[0][0] + parts[1][0] + player.points).slice(0, 3);
  }

  async Import(match: IncomingChallengeMatch): Promise<void> {
    const newKey = await this.challengeMatchPath(match);
    await this.db
      .object(`${CHALLENGES_PATH}/${newKey}`)
      .set(match)
      .then(
        _ => this.db
          .object(`${DB_INCOMING_CHALLENGE_MATCHES_LPATH}/${newKey}`)
          .set(match))
      .then(
        _ => this.messager.success('Spiel erfolgreich importiert!'),
        _ => this.messager.failure('Etwas hat nicht funktioniert :(')
      );
  }
}

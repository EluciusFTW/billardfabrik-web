import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AuthorizedComponent } from 'src/app/shared/authorized.component';
import { Db } from 'src/app/shared/firebase-utilities';
import { OwnConfirmService } from 'src/app/shared/services/own-confirm.service';
import { MatchComponent } from 'src/app/tourney-series/match/match.component';
import { Match } from 'src/app/tourney-series/models/match';
import { ContentTileComponent } from '../../shared/content-tile/content-tile.component';
import { LiveChallengeService } from '../live-challenge.service';
import { LiveChallenge } from '../models/live-challenge';
import { CreateChallengeDialogComponent } from './create-challenge-dialog/create-challenge-dialog.component';

@Component({
  templateUrl: './live-challenges.component.html',
  styleUrls: ['./live-challenges.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent, MatButton, MatchComponent]
})
export class LiveChallengesComponent extends AuthorizedComponent {

  private readonly challengeService = inject(LiveChallengeService);
  private readonly confirmService = inject(OwnConfirmService);
  private readonly dialog = inject(MatDialog);

  private readonly liveChallenges = toSignal(this.challengeService.getAll(), { initialValue: [] });
  readonly challenges = computed(() => this.liveChallenges()
    .map(challenge => ({ challenge, isOver: Match.isOver(challenge) })));

  async create(): Promise<void> {
    const challenge = await firstValueFrom(this.dialog
      .open<CreateChallengeDialogComponent, void, LiveChallenge>(CreateChallengeDialogComponent)
      .afterClosed());

    if (challenge) {
      await this.challengeService.create(challenge);
    }
  }

  scoreChanged(challenge: Db<LiveChallenge>): Promise<void> {
    return this.challengeService.updateScore(challenge);
  }

  complete(challenge: Db<LiveChallenge>): Promise<void> {
    return this.challengeService.complete(challenge);
  }

  async abandon(challenge: Db<LiveChallenge>): Promise<void> {
    const confirmed = await firstValueFrom(this.confirmService.confirm({
      title: 'Challenge abbrechen',
      message: `Soll die Challenge ${challenge.playerOne.name} vs. ${challenge.playerTwo.name} wirklich abgebrochen werden? Sie wird dabei gelöscht.`
    }));

    if (confirmed) {
      await this.challengeService.abandon(challenge);
    }
  }
}

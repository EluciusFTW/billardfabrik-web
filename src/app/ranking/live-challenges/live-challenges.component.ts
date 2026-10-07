import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom, from } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { AuthorizedComponent } from 'src/app/shared/authorized.component';
import { Db } from 'src/app/shared/firebase-utilities';
import { OwnConfirmService } from 'src/app/shared/services/own-confirm.service';
import { PlayersService } from 'src/app/players/players.service';
import { PlayerFunctions } from 'src/app/players/player-functions';
import { MatchComponent } from 'src/app/tourney-series/match/match.component';
import { Match } from 'src/app/tourney-series/models/match';
import { MatchPlayer } from 'src/app/tourney-series/models/match-player';
import { MatchStatus } from 'src/app/tourney-series/models/match-status';
import { POOL_DISCIPLINES, PoolDiscipline } from 'src/app/tourney-series/models/pool-discipline';
import { StraightPool } from 'src/app/tourney-series/models/straight-pool';
import { ContentTileComponent } from '../../shared/content-tile/content-tile.component';
import { EloMatchValidators } from '../elo-match-validators';
import { LiveChallengeService } from '../live-challenge.service';
import { LiveChallenge } from '../models/live-challenge';

const DEFAULT_RACE_LENGTH = 5;

@Component({
  templateUrl: './live-challenges.component.html',
  styleUrls: ['./live-challenges.component.scss', '../import-matches/import-single-match/import-single-match.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption, MatInput, MatButton, MatchComponent]
})
export class LiveChallengesComponent extends AuthorizedComponent {

  private readonly playersService = inject(PlayersService);
  private readonly challengeService = inject(LiveChallengeService);
  private readonly confirmService = inject(OwnConfirmService);

  private readonly liveChallenges = toSignal(this.challengeService.getAll(), { initialValue: [] });
  readonly challenges = computed(() => this.liveChallenges()
    .map(challenge => ({ challenge, isOver: Match.isOver(challenge) })));

  disciplines: PoolDiscipline[] = [...POOL_DISCIPLINES];
  straightPoolLengths = StraightPool.lengths.filter(l => l >= EloMatchValidators.minimumLength(StraightPool.discipline));
  readonly availablePlayers = toSignal(
    from(this.playersService.getEloPlayers().then(players => players.map(PlayerFunctions.displayName))),
    { initialValue: [] });

  challengeForm = new FormGroup(
    { discipline: new FormControl<PoolDiscipline>(this.disciplines[0], [Validators.required]),
      length: new FormControl<number>(DEFAULT_RACE_LENGTH, [Validators.required]),
      selectPlayerOne: new FormControl<string>('', [Validators.required]),
      selectPlayerTwo: new FormControl<string>('', [Validators.required]) },
    { validators: [
      EloMatchValidators.DuplicatePlayerValidator,
      EloMatchValidators.MinimumRaceLengthValidator] });

  private readonly discipline = toSignal(
    this.challengeForm.controls.discipline.valueChanges,
    { initialValue: this.challengeForm.controls.discipline.value });
  readonly isStraightPool = computed(() => StraightPool.is(this.discipline()));

  constructor() {
    super();
    this.challengeForm.controls.discipline.valueChanges.subscribe(discipline =>
      this.challengeForm.controls.length.setValue(
        StraightPool.is(discipline) ? StraightPool.defaultLength : DEFAULT_RACE_LENGTH));
  }

  async start(): Promise<void> {
    const value = this.challengeForm.value;
    const challenge: LiveChallenge = {
      ...Match.create(
        { ...MatchPlayer.From(value.selectPlayerOne) },
        { ...MatchPlayer.From(value.selectPlayerTwo) },
        value.discipline,
        value.length),
      status: MatchStatus.inProgress,
      startedAt: new Date().toISOString()
    };

    await this.challengeService.create(challenge);
    this.challengeForm.patchValue({ selectPlayerOne: '', selectPlayerTwo: '' });
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

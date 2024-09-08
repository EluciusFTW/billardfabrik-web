import { Component, OnInit, inject } from '@angular/core';
import { MatchPlayer } from 'src/app/tourney-series/models/match-player';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IncomingChallengeMatch } from '../../models/ranking-match';
import { EloChallengeImportService } from '../../elo-challenge-import.service';
import { TourneyFunctions } from 'src/app/tourney-series/tourney/tourney-functions';
import { POOL_DISCIPLINES, PoolDiscipline } from 'src/app/tourney-series/models/pool-discipline';
import { PlayersService } from 'src/app/players/players.service';
import { PlayerFunctions } from 'src/app/players/player-functions';
import { EloMatchValidators } from '../../elo-match-validators';

@Component({
  selector: 'app-import-single-match',
  templateUrl: './import-single-match.component.html',
  styleUrls: ['./import-single-match.component.scss']
})
export class ImportSingleMatchComponent implements OnInit {

  private readonly eloService = inject(PlayersService);
  private readonly importService = inject(EloChallengeImportService);

  disciplines: PoolDiscipline[] =  [ ...POOL_DISCIPLINES ];
  availablePlayers: string[] = [];

  selectDate: FormControl<Date>;
  matchForm: FormGroup;

  addedMatches: IncomingChallengeMatch[] = [];

  constructor() {
    this.selectDate = new FormControl<Date>(new Date(), [Validators.required]);

    this.matchForm = new FormGroup(
      { discipline: new FormControl<string>(this.disciplines[0], [Validators.required]),
        selectDate: this.selectDate = new FormControl<Date>(new Date(), [Validators.required, EloMatchValidators.NotInTheFutureValidator]),
        playerOneScore: new FormControl<number>(null, [Validators.required, Validators.min(0)]),
        playerTwoScore: new FormControl<number>(null, [Validators.required, Validators.min(0)]),
        selectPlayerOne: new FormControl<string>('', [Validators.required]),
        selectPlayerTwo:  new FormControl<string>('', [Validators.required])},
      { validators: [
        EloMatchValidators.DuplicatePlayerValidator,
        EloMatchValidators.NoWinnerValidator,
        EloMatchValidators.MinimumLengthValidator]});
  }

  async ngOnInit() {
    this.availablePlayers = await this.eloService
      .getEloPlayers()
      .then(players => players.map(PlayerFunctions.displayName))
  }

  get p1s() {
    return this.matchForm.get('playerOneScore');
  }

  get p2s() {
    return this.matchForm.get('playerTwoScore');
  }

  async submit(): Promise<void> {
    const p1s = this.matchForm.value.playerOneScore;
    const p2s = this.matchForm.value.playerTwoScore;

    const match: IncomingChallengeMatch = {
      playerOne: {
        ... MatchPlayer.From(this.matchForm.value.selectPlayerOne),
        points: p1s
      },
      playerTwo: {
        ... MatchPlayer.From(this.matchForm.value.selectPlayerTwo),
        points: p2s
      },
      discipline: this.matchForm.value.discipline,
      length: Math.max(p1s, p2s),
      date: TourneyFunctions.DateToNameFragment(new Date(this.matchForm.value.selectDate)),
      source: 'Challenge'
    }

    await this.importService.Import(match);
    this.addedMatches.push(match);
  }
}

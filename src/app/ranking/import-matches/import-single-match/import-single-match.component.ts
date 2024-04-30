import { Component, OnInit, inject } from '@angular/core';
import { firstValueFrom, map, take } from 'rxjs';
import { MatchPlayer } from 'src/app/tourney-series/models/match-player';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IncomingChallengeMatch } from '../../models/ranking-match';
import { EloChallengeImportService } from '../../elo-challenge-import.service';
import { TourneyFunctions } from 'src/app/tourney-series/tourney/tourney-functions';
import { POOL_DISCIPLINES, PoolDiscipline } from 'src/app/tourney-series/models/pool-discipline';
import { PlayersService } from 'src/app/players/players.service';
import { PlayerFunctions } from 'src/app/players/player-functions';

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

  constructor() {
    this.selectDate = new FormControl<Date>(new Date(), [Validators.required]);

    this.matchForm = new FormGroup({
      selectDiscipline: new FormControl<string>(this.disciplines[0], [Validators.required]),
      selectDate: this.selectDate = new FormControl<Date>(new Date(), [Validators.required, notInTheFutureValidator]),
      playerOneScore: new FormControl<number>(null, [Validators.required, Validators.min(0)]),
      playerTwoScore: new FormControl<number>(null, [Validators.required, Validators.min(0)]),
      selectPlayerOne: new FormControl<string>('', [Validators.required]),
      selectPlayerTwo:  new FormControl<string>('', [Validators.required])
    },
    { validators: [duplicatePlayerValidator, noWinnerValidator] });
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

  submit(): void {
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
      discipline: this.matchForm.value.selectDiscipline,
      length: Math.max(p1s, p2s),
      date: TourneyFunctions.DateToNameFragment(new Date(this.matchForm.value.selectDate)),
      source: 'Challenge'
    }

    this.importService.Import(match);
  }
}

const duplicatePlayerValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const p1 = control.get('selectPlayerOne').value;
  const p2 = control.get('selectPlayerTwo').value;

  return p1.length > 0 && p1 === p2
    ? { duplicatePlayer: true }
    : null;
};

const noWinnerValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const s1 = control.get('playerOneScore').value;
  const s2 = control.get('playerTwoScore').value;

  return s1 && s1 === s2
    ? { noWinner: true }
    : null;
};

const notInTheFutureValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  let value = new Date(control.value);
  return value > new Date()
    ? { inTheFuture: true }
    : undefined;
}

import { Component, OnInit, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { TourneyCreationService } from './tourney-creation.service';
import { Tourney } from '../models/tourney';
import { TourneyGroup } from '../models/tourney-group';
import { POOL_DISCIPLINES, PoolDiscipline } from '../models/pool-discipline';
import { StraightPool } from '../models/straight-pool';
import { PlayerCreateDialogComponent } from '../../players/player-create-dialog/player-create-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TourneyPlayer } from '../models/evaluation/tourney-player';
import { TourneysService } from '../services/tourneys.service';
import { TourneyInfo } from '../models/tourney-info';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';
import { TourneyModeViewModel } from './tourney-mode-view-model';
import { KNOCKOUT_PAIRINGS, KnockoutPairing } from '../models/knockout-pairing';
import { PlayersService } from 'src/app/players/players.service';
import { PlayerFunctions } from 'src/app/players/player-functions';
import { OrderPlayersDialogComponent } from './order-players/order-players-dialog.component';
import { SeedingScope } from './order-players/seeding-scope';
import { numberOfBracketSeeds } from './seeding.functions';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from 'src/app/players/player';
import { ContentTileComponent } from '../../shared/content-tile/content-tile.component';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelect, MatOption } from '@angular/material/select';
import { PlayerNamePipe } from '../../players/player-name.pipe';

@Component({
  templateUrl: './create-tourney.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent, MatSelectionList, MatListOption, MatButton, MatFormField, MatLabel, MatInput, FormsModule, MatSelect, MatOption, PlayerNamePipe]
})
export class CreateTourneyComponent implements OnInit{
  private readonly createTourneyService = inject(TourneyCreationService);
  private readonly tourneysService = inject(TourneysService);
  private readonly playersService = inject(PlayersService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  unique = input(false);
  tourneyName = '';

  players: TourneyPlayer[] = [];
  playModi: TourneyModeViewModel[] = [
    {
      mode: 'Gruppe + Einfach-K.O.',
      hasFirstElimination: false,
      hasGroups: true
    },
    {
      mode: 'Einfach-K.O.',
      hasFirstElimination: false,
      hasGroups: false
    },
    {
      mode: 'Doppel-K.O.',
      hasFirstElimination: true,
      hasGroups: false
    }];
  selectedPlayModus: TourneyModeViewModel = this.playModi[0];

  nrOfGroupsSelected: number;

  readonly knockoutPairings = KNOCKOUT_PAIRINGS;
  knockoutPairingSelected: KnockoutPairing = 'Random';

  private readonly rackRaceLengths = [3, 4, 5, 6, 7, 8, 9];
  private readonly defaultRackRaceLength = 4;
  raceLengthSelected: number = this.defaultRackRaceLength;

  disciplineSelected: PoolDiscipline = '9-Ball';

  get disciplines(): PoolDiscipline[] {
    return POOL_DISCIPLINES.filter(discipline => this.unique() || !StraightPool.is(discipline));
  }

  get raceLengths(): number[] {
    return StraightPool.is(this.disciplineSelected)
      ? StraightPool.lengths
      : this.rackRaceLengths;
  }

  disciplineChange(discipline: PoolDiscipline): void {
    this.raceLengthSelected = StraightPool.is(discipline)
      ? StraightPool.defaultLength
      : this.defaultRackRaceLength;
  }

  firstElimination = [
    TourneyEliminationStageType.final,
    TourneyEliminationStageType.semiFinal,
    TourneyEliminationStageType.quarterFinal
  ];
  firstEliminationSelected = TourneyEliminationStageType.final;

  tourney: Tourney = <Tourney>{};
  group: TourneyGroup[];

  async ngOnInit() {
    this.players = await this.playersService.getTourneyPlayers();
  }

  playerSelectionChange(event: any): void {
    let numberOfSelectedPlayers = event.source.selectedOptions.selected.length;
    this.nrOfGroupsSelected = this.nrOfGroups(numberOfSelectedPlayers)[0];
  }

  nrOfGroups(nrOfPlayers: number): number[] {
    return nrOfPlayers < 6
      ? [1]
      : nrOfPlayers === 6
        ? [1, 2]
        : nrOfPlayers < 12
          ? [2]
          :  nrOfPlayers < 24
            ? [4]
            : [4,8]
  }

  async addPlayer() {
    const dialog: MatDialogRef<PlayerCreateDialogComponent, Player> = this.dialog.open(PlayerCreateDialogComponent);
    var newPlayer = await firstValueFrom(dialog.afterClosed());

    if (newPlayer) {
      this.playersService
        .createPlayer(newPlayer)
        .then(_ => this.players.push(newPlayer));
    }
  }

  submitSelected(selectedItems: any[]): void {
    let players = selectedItems
      .map(item => item.value)
      .map(PlayerFunctions.displayName);

    this.submit(players, false);
  }

  async seedSelected(selectedItems: any[]) {
    let players = selectedItems
      .map(item => item.value)
      .map(PlayerFunctions.displayName);

    const dialog: MatDialogRef<OrderPlayersDialogComponent, string[]> = this.dialog.open(
      OrderPlayersDialogComponent,
      { data: { players: players, scope: this.seedingScope(players.length) } }
    );

    var sortedPlayers = await firstValueFrom(dialog.afterClosed());
    if (sortedPlayers) {
      this.submit(sortedPlayers, true);
    }
  }

  private seedingScope(numberOfPlayers: number): SeedingScope {
    return this.selectedPlayModus.hasGroups
      ? { kind: 'Groups', numberOfGroups: this.nrOfGroupsSelected }
      : { kind: 'Bracket', numberOfSeeds: numberOfBracketSeeds(numberOfPlayers) };
  }

  get canSubmit(): boolean {
    return !this.unique() || this.tourneyName.trim().length > 0;
  }

  private submit(players: string[], respectOrdering: boolean): void {
    if (!this.canSubmit) {
      return;
    }

    let info = {
      players: players,
      raceLength: this.raceLengthSelected,
      discipline: this.disciplineSelected,
      name: this.unique() ? this.tourneyName.trim() : 'Donnerstags-Turnier',
      mode: this.selectedPlayModus.mode,
      seeded: respectOrdering,
      unique: this.unique()
    };

    this.tourney = this.selectedPlayModus.mode === 'Einfach-K.O.'
      ? this.createTourneyService.createSingle(info)
      : this.selectedPlayModus.mode === 'Gruppe + Einfach-K.O.'
        ? this.createSingleWithGroups(info)
        : this.createDouble(info)

    this.tourneysService
      .update(this.tourney, { type: 'Created' })
      .then(
        key => this.navigateToTourney(key),
        // the failure has been reported already, stay on the form so nothing gets lost
        () => {});
  }

  private navigateToTourney(key: string): void {
    const path = this.unique() ? ['unique', key, 'tourney'] : [key, 'tourney'];
    this.router.navigate(path, { relativeTo: this.route.parent });
  }

  createSingleWithGroups(info: TourneyInfo): Tourney {
    let enrichedInfo = {
      ...info,
      nrOfGroups: this.nrOfGroupsSelected,
      knockoutPairing: this.knockoutPairingSelected
    }
    return this.createTourneyService.createSingleWithGroups(enrichedInfo);
  }

  createDouble(info: TourneyInfo): Tourney {
    let enrichedInfo = {
      ...info,
      firstEliminationStage: this.firstEliminationSelected
    }
    return this.createTourneyService.createDouble(enrichedInfo);
  }

  typeName(type: TourneyEliminationStageType): string {
    return TourneyEliminationStageType.map(type);
  }

  pairingName(pairing: KnockoutPairing): string {
    return KnockoutPairing.map(pairing);
  }
}

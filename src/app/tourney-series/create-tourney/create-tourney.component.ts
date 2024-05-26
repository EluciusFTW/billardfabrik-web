import { Component, OnInit, inject } from '@angular/core';
import { TourneyCreationService } from './tourney-creation.service';
import { Tourney } from '../models/tourney';
import { TourneyGroup } from '../models/tourney-group';
import { POOL_DISCIPLINES, PoolDiscipline } from '../models/pool-discipline';
import { PlayerCreateDialogComponent } from '../../players/player-create-dialog/player-create-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TourneyPlayer } from '../models/evaluation/tourney-player';
import { TourneysService } from '../services/tourneys.service';
import { TourneyInfo } from '../models/tourney-info';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';
import { TourneyModeViewModel } from './tourney-mode-view-model';
import { PlayersService } from 'src/app/players/players.service';
import { PlayerFunctions } from 'src/app/players/player-functions';
import { OrderPlayersDialogComponent } from './order-players/order-players-dialog.component';
import { firstValueFrom } from 'rxjs';
import { Player } from 'src/app/players/player';

@Component({
  templateUrl: './create-tourney.component.html',
})
export class CreateTourneyComponent implements OnInit{
  private readonly createTourneyService = inject(TourneyCreationService);
  private readonly tourneysService = inject(TourneysService);
  private readonly playersService = inject(PlayersService);
  private readonly dialog = inject(MatDialog);

  players: TourneyPlayer[] = [];
  playModi: TourneyModeViewModel[] = [
    {
      mode: 'Gruppe + Einfach-K.O.',
      hasFirstElimination: false,
      hasGroups: true,
      canBeSeeded: false,
    },
    {
      mode: 'Einfach-K.O.',
      hasFirstElimination: false,
      hasGroups: false,
      canBeSeeded: true,
    },
    {
      mode: 'Doppel-K.O.',
      hasFirstElimination: true,
      hasGroups: false,
      canBeSeeded: false,
    }];
  selectedPlayModus: TourneyModeViewModel = this.playModi[0];

  nrOfGroupsSelected: number;
  raceLengths = [3, 4, 5, 6, 7, 8, 9];
  raceLengthSelected: number = 4;

  disciplines: PoolDiscipline[] = [ ... POOL_DISCIPLINES ];
  disciplineSelected: PoolDiscipline = '9-Ball';

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
      { data: { players: players} }
    );

    var sortedPlayers = await firstValueFrom(dialog.afterClosed());
    if (sortedPlayers) {
      this.submit(sortedPlayers, true);
    }
  }

  private submit(players: string[], respectOrdering: boolean): void {
    let info = {
      players: players,
      raceLength: this.raceLengthSelected,
      discipline: this.disciplineSelected,
      name: 'Donnerstags-Turnier',
      mode: this.selectedPlayModus.mode,
      seeded: respectOrdering
    };

    this.tourney = this.selectedPlayModus.mode === 'Einfach-K.O.'
      ? this.createTourneyService.createSingle(info)
      : this.selectedPlayModus.mode === 'Gruppe + Einfach-K.O.'
        ? this.createSingleWithGroups(info)
        : this.createDouble(info)

    this.tourneysService.update(this.tourney, { type: 'Created' });
  }

  createSingleWithGroups(info: TourneyInfo): Tourney {
    let enrichedInfo = {
      ...info,
      nrOfGroups: this.nrOfGroupsSelected
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
}

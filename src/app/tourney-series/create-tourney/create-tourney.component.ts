import { Component, OnInit, inject } from '@angular/core';
import { TourneyCreationService } from '../services/creation/tourney-creation.service';
import { Tourney } from '../models/tourney';
import { TourneyGroup } from '../models/tourney-group';
import { POOL_DISCIPLINES, PoolDiscipline } from '../models/pool-discipline';
import { PlayerCreateDialogComponent } from '../../players/player-create-dialog/player-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TourneyPlayer } from '../models/evaluation/tourney-player';
import { TourneysService } from '../services/tourneys.service';
import { TourneyInfo } from '../models/tourney-info';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';
import { TourneyModeViewModel } from './tourney-mode-view-model';
import { PlayersService } from 'src/app/players/players.service';
import { PlayerFunctions } from 'src/app/players/player-functions';

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
      hasGroups: true
    },
    {
      mode: 'Doppel-K.O.',
      hasFirstElimination: true,
      hasGroups: false
    }];
  selectedPlayModus: TourneyModeViewModel = this.playModi[0];

  nrOfGroupsSelected: number;

  raceLengths = [3, 4, 5, 6];
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

  addPlayer(): void {
    this.dialog
      .open(PlayerCreateDialogComponent, { data: {} })
      .afterClosed()
      .subscribe(
        result => {
          if (result) {
            const player = result as TourneyPlayer;
            this.playersService
              .createPlayer(player)
              .then(_ => this.players.push(player));
          }
        }
      )
  }

  submitSelected(selectedItems: any[]): void {
    let selectedPlayerNames = selectedItems
      .map(item => item.value)
      .map(player => PlayerFunctions.displayName(player));

    let info = {
      players: selectedPlayerNames,
      raceLength: this.raceLengthSelected,
      discipline: this.disciplineSelected,
      name: 'Donnerstags-Turnier',
      mode: this.selectedPlayModus.mode
    };

    this.tourney = this.selectedPlayModus.mode === 'Gruppe + Einfach-K.O.'
      ? this.createSingle(info)
      : this.createDouble(info)

    this.tourneysService.update(this.tourney, { type: 'Created' });
  }

  createSingle(info: TourneyInfo): Tourney {
    let enrichedInfo = {
      ...info,
      nrOfGroups: this.nrOfGroupsSelected
    }
    return this.createTourneyService.createSingle(enrichedInfo);
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

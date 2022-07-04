import { Component } from '@angular/core';
import { TourneyCreationService } from '../services/creation/tourney-creation.service';
import { Tourney } from '../models/tourney';
import { TourneyGroup } from '../models/tourney-group';
import { PoolDisciplineMapper, PoolDiscipline } from '../models/pool-discipline';
import { Subscription } from 'rxjs';
import { PlayersService } from '../services/players.service';
import { TourneyPlayerCreateDialogComponent } from '../tourney-player-create-dialog/tourney-player-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TourneyPlayer } from '../models/evaluation/tourney-player';
import { TourneysService } from '../services/tourneys.service';
import { TourneyMode } from '../models/tourney-mode';
import { TourneyInfo } from '../models/tourney-info';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';

@Component({
  templateUrl: './create-tourney.component.html',
  styleUrls: ['./create-tourney.component.scss']
})
export class CreateTourneyComponent {

  players: TourneyPlayer[] = [];
  private playerSub: Subscription;

  playModi: string[] = ['Gruppen + Einfach-K.O.', 'Doppel-K.O.'];
  selectedPlayModus: string;

  possibleNrOfGroups: number[] = [1, 2, 4];
  nrOfGroupsSelected: number = 1;

  raceLengths: number[] = [3, 4, 5, 6];
  raceLengthSelected: number = 4;

  disciplines: string[] = [];
  disciplineSelected: string;

  firstElimination: TourneyEliminationStageType[] = [
    TourneyEliminationStageType.final,
    TourneyEliminationStageType.semiFinal,
    TourneyEliminationStageType.quarterFinal
  ];
  firstEliminationSelected: TourneyEliminationStageType;

  tourney: Tourney = <Tourney>{};
  group: TourneyGroup[];

  constructor(
    private createTourneyService: TourneyCreationService,
    private tourneysService: TourneysService,
    private playersService: PlayersService,
    public dialog: MatDialog
  ) {
    this.disciplines = PoolDisciplineMapper.getAllValues();
    this.disciplineSelected = PoolDisciplineMapper.map(PoolDiscipline.NineBall);

    this.playerSub = this.playersService
      .getAll()
      .subscribe(
        players => {
          const currentPlayerNames = this.players.map(player => this.displayName(player));
          const newPlayers = players.filter(player => !currentPlayerNames.includes(this.displayName(player)));
          newPlayers.forEach(p => this.players.push(p));
        },
      );
  }

  hasGroups(): boolean {
    return this.selectedPlayModus === 'Gruppen + Einfach-K.O.';
  }

  hasFirstElimination(): boolean {
    return this.selectedPlayModus === 'Doppel-K.O.';
  }

  addPlayer(): void {
    const dialogRef = this.dialog.open(TourneyPlayerCreateDialogComponent, {
      data: {},
      width: '300px',
      hasBackdrop: true
    });

    dialogRef
      .afterClosed()
      .subscribe(
        result => {
          if (result) {
            const returnItem = result as TourneyPlayer;
            this.playersService.updatePlayer(returnItem);
          }
        }
      )
  }

  submitSelected(selectedItems: any[]): void {
    let selectedPlayerNames = selectedItems
      .map(item => item.value)
      .map(player => this.displayName(player));

    let info = {
      players: selectedPlayerNames,
      raceLength: this.raceLengthSelected,
      discipline: PoolDisciplineMapper.mapToEnum(this.disciplineSelected),
      name: 'Donnerstags-Turnier',
      mode: this.selectedPlayModus === 'Gruppen + Einfach-K.O.'
        ? TourneyMode.GruopsThenSingleElimination
        : TourneyMode.DoubleElimination
    };

    this.tourney = this.selectedPlayModus === 'Gruppen + Einfach-K.O.'
      ? this.createSingle(info)
      : this.createDouble(info)

    //this.tourneysService.update(this.tourney, { type: 'Created' });
  }

  createSingle(info: TourneyInfo): Tourney {
    let enrichedInfo = {
      ... info,
      nrOfGroups: this.nrOfGroupsSelected
    }
    return this.createTourneyService.createSingle(enrichedInfo);
  }

  createDouble(info: TourneyInfo): Tourney {
    let enrichedInfo = {
      ... info,
      firstEliminationStage: TourneyEliminationStageType.final
    }
    return this.createTourneyService.createDouble(enrichedInfo);
  }

  displayName(player: TourneyPlayer): string {
    return `${player.firstName} ${player.lastName}`;
  }

  ngOnDestroy() {
    this.playerSub.unsubscribe();
  }
}

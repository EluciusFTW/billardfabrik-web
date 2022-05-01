import { Component } from '@angular/core';
import { TourneyCreationService } from '../services/tourney-creation.service';
import { Tourney } from '../models/tourney';
import { TourneyGroup } from '../models/tourney-group';
import { PoolDisciplineMapper, PoolDiscipline } from '../models/pool-discipline';
import { Subscription } from 'rxjs';
import { PlayersService } from '../services/players.service';
import { TourneyPlayerCreateDialogComponent } from '../tourney-player-create-dialog/tourney-player-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TourneyPlayer } from '../models/tourney-player';
import { TourneysService } from '../services/tourneys.service';
import { TourneyPhaseEvent } from '../models/tourney-phase-event';
import { TourneyMode } from '../models/tourney-mode';

@Component({
  templateUrl: './create-tourney.component.html',
  styleUrls: ['./create-tourney.component.scss']
})
export class CreateTourneyComponent {

  players: TourneyPlayer[] = [];
  private playerSub: Subscription;

  possibleNrOfGroups: number[] = [1, 2, 4];
  nrOfGroupsSelected: number = 1;

  raceLengths: number[] = [3, 4, 5, 6];
  raceLengthSelected: number = 4;

  disciplines: string[] = [];
  disciplineSelected: string;

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

    this.playerSub = this.playersService.getAll().subscribe(
      players => {
        const currentPlayerNames = this.players.map(player => this.displayName(player));
        const newPlayers = players.filter(player => !currentPlayerNames.includes(this.displayName(player)));
        newPlayers.forEach(p => this.players.push(p));
      },
      // e => this.messageService.failure('Fehler', 'Wir konnten leider nicht zum news-feed verbinden. Bitte versuchen Sie die Seite erneut zu laden.')
    );
  }

  addPlayer(): void {
    const dialogRef = this.dialog.open(TourneyPlayerCreateDialogComponent, {
      data: {},
      width: '300px',
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          const returnItem = result as TourneyPlayer;
          this.playersService.updatePlayer(returnItem);
        }
      }
    )
  }

  submitSelected(s: any[]): void {
    this.tourney = this.createTourneyService.create(
      {
        players: s.map(e => this.displayName(e.value)),
        nrOfGroups: this.nrOfGroupsSelected,
        raceLength: this.raceLengthSelected,
        discipline: PoolDisciplineMapper.mapToEnum(this.disciplineSelected),
        name: 'Donnerstags-Turnier',
        mode: TourneyMode.GruopsThenSingleElimination
      });

    this.tourneysService.update(this.tourney, TourneyPhaseEvent.created);
  }

  displayName(player: TourneyPlayer): string {
    return player.firstName + ' ' + player.lastName;
  }

  ngOnDestroy() {
    this.playerSub.unsubscribe();
  }
}

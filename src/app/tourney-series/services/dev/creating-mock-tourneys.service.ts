import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PoolDiscipline } from '../../models/pool-discipline';
import { Tourney } from '../../models/tourney';
import { TourneyEliminationStageType } from '../../models/tourney-elimination-stage';
import { DoubleEliminationTourneyInfo, GroupsThenSingleEliminationTourneyInfo, TourneyInfo } from '../../models/tourney-info';
import { TourneyMode } from '../../models/tourney-mode';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';
import { TourneyCreationService } from '../creation/tourney-creation.service';

@Injectable()
export class CreatingMockTourneysService {

  constructor(private tcs: TourneyCreationService) { }

  get(id: any): Observable<Tourney> {
    let info = id % 2 == 0
      ? this.getDoubleEliminationTourneyInfo(id)
      : this.getTourneyInfo(id);

    return of(this.tcs.create(info));
  }

  private getDoubleEliminationTourneyInfo(nr: number): TourneyInfo {
    return {
      players: this.getPlayers(nr),
      raceLength: 2,
      discipline: PoolDiscipline.BankPool,
      mode: TourneyMode.DoubleElimination,
      firstEliminationStage: TourneyEliminationStageType.quarterFinal,
      name: 'Mock DE Tourney',
    } as DoubleEliminationTourneyInfo;
  }

  private getTourneyInfo(nr: number): TourneyInfo {
    return {
      players: this.getPlayers(nr),
      raceLength: 4,
      discipline: PoolDiscipline.NineBall,
      nrOfGroups: 4,
      mode: TourneyMode.GruopsThenSingleElimination,
      name: 'Mock SE Tourney',
    } as GroupsThenSingleEliminationTourneyInfo;
  }

  private getPlayers(amount: number): string[] {
    let players = new Array(amount);
    for (let i = 0; i < amount; i++) {
      players[i] = `Player ${i}`;
    }
    return players;
  }

  getAll(): Observable<Tourney[]> {
    return of([]);
  }

  update(tourney: Tourney, event: TourneyPhaseEvent): void {
  }

  save(tourney: Tourney): void {
  }
}

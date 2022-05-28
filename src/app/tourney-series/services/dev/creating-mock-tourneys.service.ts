import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PoolDiscipline } from '../../models/pool-discipline';
import { Tourney } from '../../models/tourney';
import { TourneyEliminationStageType } from '../../models/tourney-elimination-stage';
import { DoubleEliminationTourneyInfo, TourneyInfo } from '../../models/tourney-info';
import { TourneyMode } from '../../models/tourney-mode';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';
import { TourneyCreationService } from '../creation/tourney-creation.service';

@Injectable()
export class CreatingMockTourneysService {

  constructor(private tcs: TourneyCreationService) { }

  get(id: any): Observable<Tourney> {
    return of(this.tcs.create(this.getTourneyInfo(id)));
  }

  private getTourneyInfo(nr: number): TourneyInfo {
    return {
      players: this.getPlayers(nr),
      raceLength: 2,
      discipline: PoolDiscipline.BankPool,
      mode: TourneyMode.DoubleElimination,
      firstEliminationStage: TourneyEliminationStageType.quarterFinal,
      name: 'Mock DE Tourney',
    } as DoubleEliminationTourneyInfo;
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

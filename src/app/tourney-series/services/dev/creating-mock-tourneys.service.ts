import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PoolDiscipline } from '../../models/pool-discipline';
import { Tourney } from '../../models/tourney';
import { DoubleEliminationTourneyInfo, GroupsThenSingleEliminationTourneyInfo } from '../../models/tourney-info';
import { TourneyMode } from '../../models/tourney-mode';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';
import { TourneyEliminationStageType } from '../../models/tourney-single-elimination-stage-type';
import { TourneyCreationService } from '../creation/tourney-creation.service';
import { TourneyEventService } from '../event-handling/tourney-event.service';

@Injectable()
export class CreatingMockTourneysService {

  constructor(private tcs: TourneyCreationService, private eventService: TourneyEventService) { }

  get(id: any): Observable<Tourney> {
    let tourney = id % 2 == 0
      ? this.tcs.createDouble(this.getDoubleEliminationTourneyInfo(id))
      : this.tcs.createSingle(this.getTourneyInfo(id));

    return of(tourney);
  }

  private getDoubleEliminationTourneyInfo(nr: number): DoubleEliminationTourneyInfo {
    return {
      players: this.getPlayers(nr),
      raceLength: 1,
      discipline: PoolDiscipline.BankPool,
      mode: TourneyMode.DoubleElimination,
      firstEliminationStage: TourneyEliminationStageType.semiFinal,
      name: 'Mock DE Tourney',
    } as DoubleEliminationTourneyInfo;
  }

  private getTourneyInfo(nr: number): GroupsThenSingleEliminationTourneyInfo {
    return {
      players: this.getPlayers(nr),
      raceLength: 1,
      discipline: PoolDiscipline.NineBall,
      nrOfGroups: 4,
      mode: TourneyMode.GroupsThenSingleElimination,
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
    this.eventService.apply(tourney, event);
  }

  save(tourney: Tourney): void { }
}

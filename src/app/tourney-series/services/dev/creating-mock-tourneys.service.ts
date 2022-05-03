import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PoolDiscipline } from '../../models/pool-discipline';
import { Tourney } from '../../models/tourney';
import { TourneyInfo } from '../../models/tourney-info';
import { TourneyMode } from '../../models/tourney-mode';
import { TourneyCreationService } from '../creation/tourney-creation.service';

@Injectable()
export class CreatingMockTourneysService {

  constructor(private tcs: TourneyCreationService) { }

  get(id: any): Observable<Tourney> {
    return of(this.tcs.create(this.getTourneyInfo()));
  }

  private getTourneyInfo(): TourneyInfo {
    return {
      players: this.getPlayers(32),
      raceLength: 2,
      discipline: PoolDiscipline.BankPool,
      mode: TourneyMode.DoubleElimination,
      name: 'Mock DE Tourney',
    } as TourneyInfo;
  }

  private getPlayers(amount: number): string[] {
    let players = new Array(amount);
    for (let i = 0; i < amount; i++) {
      players[i] = `Player ${i}`;
    }
    return players;
  }
}

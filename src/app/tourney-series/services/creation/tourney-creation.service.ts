import { Injectable } from '@angular/core';
import { DoubleEliminationTourneyInfo, GroupsThenSingleEliminationTourneyInfo, TourneyInfo } from '../../models/tourney-info';
import { Tourney } from '../../models/tourney';
import { TourneyMeta } from '../../models/tourney-meta';
import { TourneyStatus } from '../../models/tourney-status';
import { TourneyMode } from '../../models/tourney-mode';
import { GroupsThenSingleEliminationCreationService } from './groups-then-single-elimination-creation.service';
import { DoubleEliminationCreationService } from './double-elimination-creation.service';

@Injectable()
export class TourneyCreationService {

  constructor(
    private single: GroupsThenSingleEliminationCreationService,
    private double: DoubleEliminationCreationService) {
  }

  create(info: TourneyInfo): Tourney {
    let tourney = info.mode === TourneyMode.GruopsThenSingleElimination
      ? this.single.create(info as GroupsThenSingleEliminationTourneyInfo)
      : this.double.create(info as DoubleEliminationTourneyInfo);

    return {
      ...tourney,
      meta: this.buildMeta(info)
    }
  }

  private buildMeta(info: TourneyInfo): TourneyMeta {
    return {
      date: this.getDateString(),
      name: info.name,
      discipline: info.discipline,
      modus: info.mode,
      status: TourneyStatus.new
    }
  }

  private getDateString(): string {
    const date = new Date();
    const yy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    return [yy,
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd
    ].join('');
  }
}

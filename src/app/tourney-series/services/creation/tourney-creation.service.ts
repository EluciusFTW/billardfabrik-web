import { Injectable } from '@angular/core';
import { DoubleEliminationTourneyInfo, GroupsThenSingleEliminationTourneyInfo, TourneyInfo } from '../../models/tourney-info';
import { TourneyMeta } from '../../models/tourney-meta';
import { TourneyStatus } from '../../models/tourney-status';
import { GroupsThenSingleEliminationCreationService } from './groups-then-single-elimination-creation.service';
import { DoubleEliminationCreationService } from './double-elimination-creation.service';
import { TourneyFunctions } from '../../tourney/tourney-functions';

@Injectable()
export class TourneyCreationService {

  constructor(
    private single: GroupsThenSingleEliminationCreationService,
    private double: DoubleEliminationCreationService) {
  }

  createSingle(info: GroupsThenSingleEliminationTourneyInfo) {
    return {
      ... this.single.create(info),
      meta: this.buildMeta(info)
    }
  }

  createDouble(info: DoubleEliminationTourneyInfo) {
    return {
      ... this.double.create(info),
      meta: this.buildMeta(info)
    }
  }

  private buildMeta(info: TourneyInfo): TourneyMeta {
    return {
      date: TourneyFunctions.DateToNameFragment(new Date()),
      name: info.name,
      numberOfPlayers: info.players.length,
      discipline: info.discipline,
      modus: info.mode,
      status: TourneyStatus.new
    }
  }
}

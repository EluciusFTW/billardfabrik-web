import { Injectable } from '@angular/core';
import {
  DoubleEliminationTourneyInfo,
  GroupsThenSingleEliminationTourneyInfo,
  SingleEliminationTourneyInfo,
  TourneyInfo
} from '../../models/tourney-info';
import { TourneyMeta } from '../../models/tourney-meta';
import { TourneyStatus } from '../../models/tourney-status';
import { DoubleEliminationFunctions } from './double-elimination.functions';
import { TourneyFunctions } from '../../tourney/tourney-functions';
import { SingleEliminationFunctions } from './single-elimination.functions';
import { GroupsThenSingleEliminationFunctions } from './groups-then-single-elimination.functions';

@Injectable()
export class TourneyCreationService {

  createSingle(info: SingleEliminationTourneyInfo) {
    return {
      eliminationStages: SingleEliminationFunctions.create(info),
      meta: this.buildMeta(info)
    }
  }

  createSingleWithGroups(info: GroupsThenSingleEliminationTourneyInfo) {
    return {
      ... GroupsThenSingleEliminationFunctions.create(info),
      meta: this.buildMeta(info),
    }
  }

  createDouble(info: DoubleEliminationTourneyInfo) {
    return {
      ... DoubleEliminationFunctions.create(info),
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

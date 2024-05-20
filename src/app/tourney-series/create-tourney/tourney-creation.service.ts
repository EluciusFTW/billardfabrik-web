import { Injectable } from '@angular/core';
import {
  DoubleEliminationTourneyInfo,
  GroupsThenSingleEliminationTourneyInfo,
  SingleEliminationTourneyInfo,
  TourneyInfo
} from '../models/tourney-info';
import { TourneyMeta } from '../models/tourney-meta';
import { TourneyStatus } from '../models/tourney-status';
import { TourneyFunctions } from '../tourney/tourney-functions';
import { createEmptySingleEliminationStages, createSingleEliminationStages } from './single-elimination.functions';
import { createGroups, determineStartingStageAfterGroups } from './groups.functions';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';
import { createDoubleEliminationStages } from './double-elimination-stage.functions';

@Injectable()
export class TourneyCreationService {

  createSingle(info: SingleEliminationTourneyInfo) {
    return {
      eliminationStages: createSingleEliminationStages(info),
      meta: this.buildMeta(info)
    }
  }

  createSingleWithGroups(info: GroupsThenSingleEliminationTourneyInfo) {
    const eliminationStartsAtStage = determineStartingStageAfterGroups(info);
    return {
      groups: createGroups(info),
      eliminationStages: createEmptySingleEliminationStages(info, eliminationStartsAtStage),
      meta: this.buildMeta(info),
    }
  }

  createDouble(info: DoubleEliminationTourneyInfo) {
    let doubleEliminationDownTo = TourneyEliminationStageType.numberOfPlayers(info.firstEliminationStage);
    return {
      doubleEliminationStages: createDoubleEliminationStages(info, doubleEliminationDownTo),
      eliminationStages: createEmptySingleEliminationStages(info, info.firstEliminationStage),
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

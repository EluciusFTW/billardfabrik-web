import { TourneyDoubleEliminationStageType } from "./tourney-double-elimination-stage-type";
import { TourneyEliminationStageType } from "./tourney-single-elimination-stage-type";

type EventType =
  | 'Created'
  | 'Started'
  | 'ScoreChanged'
  | 'GroupFinalized'
  | 'SingleEliminationStageFinalized'
  | 'DoubleEliminationStageFinalized'
  | 'ResultsPostProcessed'

export abstract class TourneyEventBase {
  abstract type: EventType
}

export class CreationEvent extends TourneyEventBase {
  type: 'Created';
}

export class StartEvent extends TourneyEventBase {
  type: 'Started';
}

export class ScoreChangedEvent extends TourneyEventBase {
  type: 'ScoreChanged';
}

export class GroupFinalizedEvent extends TourneyEventBase {
  type: 'GroupFinalized';
}

export class SingleEliminationStageFinalizedEvent extends TourneyEventBase {
  type: 'SingleEliminationStageFinalized';
  stage: TourneyEliminationStageType;

  constructor(stage: TourneyEliminationStageType) {
    super();
    this.stage = stage;
  }
}

export class DoubleEliminationStageFinalizedEvent extends TourneyEventBase {
  type: 'DoubleEliminationStageFinalized';
  stage: TourneyDoubleEliminationStageType;

  constructor(stage: TourneyDoubleEliminationStageType) {
    super();
    this.stage = stage;
  }
}

export class ResultsPostProcessedEvent extends TourneyEventBase {
  type: 'ResultsPostProcessed';
}

export type TourneyPhaseEvent =
  | CreationEvent
  | StartEvent
  | ScoreChangedEvent
  | GroupFinalizedEvent
  | DoubleEliminationStageFinalizedEvent
  | SingleEliminationStageFinalizedEvent
  | ResultsPostProcessedEvent

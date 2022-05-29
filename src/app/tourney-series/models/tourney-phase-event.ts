import { TourneyDoubleEliminationStageType } from "./tourney-double-elimination-stage";
import { TourneyEliminationStageType } from "./tourney-elimination-stage"

export type EventType =
  | 'Created'
  | 'Started'
  | 'ScoreChanged'
  | 'GroupStageFinalized'
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

export class GroupStageFinalizedEvent extends TourneyEventBase {
  type: 'GroupStageFinalized';
}

export class SingleEliminationStageFinalizedEvent extends TourneyEventBase {
  type: 'SingleEliminationStageFinalized';
  stage: TourneyEliminationStageType;
}

export class DoubleEliminationStageFinalizedEvent extends TourneyEventBase {
  type: 'DoubleEliminationStageFinalized';
  stage: TourneyDoubleEliminationStageType;
}

export class ResultsPostProcessedEvent extends TourneyEventBase {
  type: 'ResultsPostProcessed';
}

export type TPE =
  | CreationEvent
  | StartEvent
  | ScoreChangedEvent
  | GroupStageFinalizedEvent
  | DoubleEliminationStageFinalizedEvent
  | SingleEliminationStageFinalizedEvent
  | ResultsPostProcessedEvent

export enum TourneyPhaseEvent{
    created = 0,
    started = 1,
    scoreChanged = 2,
    groupStageFinalized = 3,
    eliminationStageFinalized = 4,
    resultsPostProcessed = 5
}

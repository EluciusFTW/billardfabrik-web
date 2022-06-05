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

export type CreationEvent = {
  type: 'Created';
}

export type StartEvent = {
  type: 'Started';
}

export type ScoreChangedEvent = {
  type: 'ScoreChanged';
}

export type GroupFinalizedEvent = {
  type: 'GroupFinalized';
}

export type SingleEliminationStageFinalizedEvent = {
  type: 'SingleEliminationStageFinalized';
  stage: TourneyEliminationStageType;
}

export type DoubleEliminationStageFinalizedEvent = {
  type: 'DoubleEliminationStageFinalized';
  stage: TourneyDoubleEliminationStageType;
}

export type ResultsPostProcessedEvent = {
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

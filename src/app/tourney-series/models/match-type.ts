import { TourneyDoubleEliminationStageType } from "./tourney-double-elimination-stage-type";
import { TourneyEliminationStage } from "./tourney-elimination-stage";

export enum MatchType {
  Group,
  SingleElimination,
  Challenge,
  League,
  Other,
  DoubleEliminationWinner,
  DoubleEliminationLoser,
}

export namespace MatchType {
  export function FromEliminationStage(stage: TourneyEliminationStage): MatchType {
    switch (stage.eliminationType) {
      case 'Single':
        return MatchType.SingleElimination;
      case 'Double':
        return TourneyDoubleEliminationStageType.isWinnerStage(stage.type)
          ? MatchType.DoubleEliminationWinner
          : MatchType.DoubleEliminationLoser;
    }
  }
}

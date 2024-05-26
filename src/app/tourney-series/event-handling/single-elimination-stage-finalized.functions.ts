import { Match } from '../models/match';
import { Tourney } from '../models/tourney';
import { SingleEliminationEliminationStage } from '../models/tourney-elimination-stage';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';
import { TourneyStatus } from '../models/tourney-status';


export function handleSingleEliminationStageFinalized(tourney: Tourney, finalizedStageType: TourneyEliminationStageType): void {
  let finalizedStage = getStage(tourney, finalizedStageType);
  if (finalizedStage.type > TourneyEliminationStageType.semiFinal) {
    populateNextStage(tourney, finalizedStage)
  } else if (finalizedStage.type === TourneyEliminationStageType.semiFinal) {
    populateFinals(tourney, finalizedStage);
  }

  completeTourneyIfAllStatesAreFinalized(tourney);
}

function populateNextStage(tourney: Tourney, finalizedStage: SingleEliminationEliminationStage): void {
  let pairs = getWinnersChunked(finalizedStage.matches);
  const next = TourneyEliminationStageType.after(finalizedStage.type);
  prepareStage(tourney, next, pairs);
}

function populateFinals(tourney: Tourney, finalizedStage: SingleEliminationEliminationStage): void {
  let winners = finalizedStage.matches.map(match => Match.winner(match).name);
  prepareStage(tourney, TourneyEliminationStageType.final, [winners]);

  let losers = finalizedStage.matches.map(match => Match.loser(match).name);
  prepareStage(tourney, TourneyEliminationStageType.thirdPlace, [losers]);
}

function completeTourneyIfAllStatesAreFinalized(tourney: Tourney): void {
  if (!tourney.eliminationStages.find(stage => stage.status !== TourneyPhaseStatus.finalized)) {
    tourney.meta.status = TourneyStatus.completed;
  }
}

function getStage(tourney: Tourney, stageType: TourneyEliminationStageType): SingleEliminationEliminationStage {
  const stage = tourney.eliminationStages.find(stage => stage.type === stageType);
  if (!stage) {
    throw Error(`Cannot finalize a stage of type ${stageType}, because the tourney has none.`);
  }
  if (stage.status !== TourneyPhaseStatus.finalized) {
    throw Error(`Cannot process finalization event because the stage ${stageType} is not finalized.`);
  }
  return stage;
}

function prepareStage(tourney: Tourney, stageType: TourneyEliminationStageType, playerPairs: string[][]) {
  let stage = tourney.eliminationStages.find(stage => stage.type === stageType);
  stage.matches.forEach(match => {
    let pair = playerPairs.pop();
    populatePlayers(match, pair);
  });
  stage.status = TourneyPhaseStatus.readyOrOngoing;
}

function getWinnersChunked(matches: Match[]): string[][] {
  let winners = matches.map(match => Match.winner(match).name);
  let pairs: string[][] = [];
  while (winners.length > 0) {
    pairs.push(winners.splice(0, 2));
  }
  return pairs;
}

function populatePlayers(match: Match, pairOfPlayers: string[]): void {
  match.playerOne.name = pairOfPlayers[0];
  match.playerTwo.name = pairOfPlayers[1];
}

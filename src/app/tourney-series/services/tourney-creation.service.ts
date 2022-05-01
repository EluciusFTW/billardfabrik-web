import { Injectable } from '@angular/core';
import { TourneyInfo } from '../models/tourney-info';
import { Tourney } from '../models/tourney';
import { TourneyGroup } from '../models/tourney-group';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { Match } from '../models/match';
import { MatchStatus } from '../models/match-status';
import { MatchPlayer } from '../models/match-player';
import { TourneyMeta } from '../models/tourney-meta';
import { TourneyStatus } from '../models/tourney-status';
import { TourneyEliminationStage, TourneyEliminationStageType } from '../models/tourney-elimination-stage';
import { TourneyMode } from '../models/tourney-mode';
import { TourneyDoubleEliminationStage } from '../models/tourney-double-elimination-stage';

@Injectable()
export class TourneyCreationService {

  create(info: TourneyInfo): Tourney {
    let tourney = info.mode === TourneyMode.GruopsThenSingleElimination
      ? this.CreateGroupsAndSingleElimination(info)
      : this.CreateDoubleElimination(info);

    return {
      ...tourney,
      meta: this.buildMeta(info)
    }
  }

  private CreateGroupsAndSingleElimination(info: TourneyInfo): Tourney {
    let randomOrderedPlayers = this.reOrderRandomly(info.players);
    return {
      groups: this.buildGroups(randomOrderedPlayers, info),
      eliminationStages: this.buildStages(info)
    }
  }

  private CreateDoubleElimination(info: TourneyInfo) {
    return {
      doubleEliminationStages: this.buildDoubleEliminationStages(info),
      eliminationStages: this.buildStages(info)
    }
  }

  private buildDoubleEliminationStages(info: TourneyInfo): TourneyDoubleEliminationStage[] {
    throw new Error('Method not implemented.');
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

  private reOrderRandomly(players: string[]): string[] {
    let randomOrderedPlayers: string[] = [];
    while (players.length > 0) {
      let randomIndex = Math.floor(Math.random() * players.length);
      randomOrderedPlayers.push(players[randomIndex]);
      players.splice(randomIndex, 1);
    }
    return randomOrderedPlayers;
  }

  private buildGroups(players: string[], info: TourneyInfo): TourneyGroup[] {
    let groups: TourneyGroup[] = [];
    let groupSize = Math.ceil(players.length / info.nrOfGroups);
    let groupNumber = 1

    while (groupNumber <= info.nrOfGroups) {
      let chunk = players.splice(0, groupSize - 1);
      groups.push({
        number: groupNumber++,
        players: chunk,
        matches: [],
        status: TourneyPhaseStatus.waitingForApproval
      });
    }

    players.forEach((player, index) => groups[index].players.push(player));
    groups.forEach(group => group.matches = this.buildMatches(group.players, info))

    return groups;
  }

  private determineStartingStage(info: TourneyInfo): TourneyEliminationStageType {
    if (info.mode === TourneyMode.GruopsThenSingleElimination) {
      return info.nrOfGroups === 8
        ? TourneyEliminationStageType.eigthFinal
        : info.nrOfGroups >= 4
          ? TourneyEliminationStageType.quarterFinal
          : info.nrOfGroups >= 2
            ? TourneyEliminationStageType.semiFinal
            : TourneyEliminationStageType.final;
    }

    return TourneyEliminationStageType.final;
  }

  private buildStages(info: TourneyInfo): TourneyEliminationStage[] {
    let stages: TourneyEliminationStage[] = [];
    let startingStage = this.determineStartingStage(info);

    if (startingStage === TourneyEliminationStageType.eigthFinal) {
      stages.push({
        type: TourneyEliminationStageType.eigthFinal,
        players: [],
        matches: this.buildEliminationMatches(8, info),
        status: TourneyPhaseStatus.waitingForApproval
      });
    };

    if (startingStage <= TourneyEliminationStageType.quarterFinal) {
      stages.push({
        type: TourneyEliminationStageType.quarterFinal,
        players: [],
        matches: this.buildEliminationMatches(4, info),
        status: TourneyPhaseStatus.waitingForApproval
      });
    };

    if (startingStage <= TourneyEliminationStageType.semiFinal) {
      stages.push({
        type: TourneyEliminationStageType.semiFinal,
        players: [],
        matches: this.buildEliminationMatches(2, info),
        status: TourneyPhaseStatus.waitingForApproval
      });
      stages.push({
        type: TourneyEliminationStageType.thirdPlace,
        players: [],
        matches: this.buildEliminationMatches(1, info),
        status: TourneyPhaseStatus.waitingForApproval
      });
    };

    stages.push({
      type: TourneyEliminationStageType.final,
      players: [],
      matches: this.buildEliminationMatches(1, info),
      status: TourneyPhaseStatus.waitingForApproval
    });

    return stages;
  }

  private buildMatches(players: string[], info: TourneyInfo): Match[] {
    var listings = this.listings(players.length);
    return listings.map(listing => this.ToMatch(listing, players, info));
  }

  private buildEliminationMatches(nrOfMatches: number, info: TourneyInfo): Match[] {
    const unknownPlayer = this.toMatchPlayer('t.b.a.');
    const matchPlaceHolder = {
      playerOne: unknownPlayer,
      playerTwo: unknownPlayer,
      discipline: info.discipline,
      length: info.raceLength,
      status: MatchStatus.notStarted
    }

    let matches: Match[] = [];
    for (let i = 0; i < nrOfMatches; i++) {
      matches.push(matchPlaceHolder);
    }
    return matches;
  }

  private listings(nrOfPlayers: number): number[][] {
    switch (nrOfPlayers) {
      case 2: return [
        [1, 2]
      ];
      case 3: return [
        [1, 2],
        [1, 3],
        [2, 3]
      ];
      case 4: return [
        [1, 2], [3, 4],
        [1, 3], [2, 4],
        [1, 4], [2, 3]
      ];
      case 5: return [
        [1, 2], [3, 4],
        [1, 3], [2, 5],
        [1, 4], [3, 5],
        [1, 5], [2, 4],
        [2, 3], [4, 5]
      ];
      case 6: return [
        [1, 2], [3, 4], [5, 6],
        [1, 3], [2, 5], [4, 6],
        [1, 4], [2, 6], [3, 5],
        [1, 5], [2, 4], [3, 6],
        [1, 6], [2, 3], [4, 5]
      ];
      default: throw new Error(nrOfPlayers + " is not a valid group size!");
    }
  }

  private ToMatch(listing: number[], players: string[], info: TourneyInfo): Match {
    return {
      playerOne: this.toMatchPlayer(players[listing[0] - 1]),
      playerTwo: this.toMatchPlayer(players[listing[1] - 1]),
      discipline: info.discipline,
      length: info.raceLength,
      status: MatchStatus.notStarted
    }
  }

  private toMatchPlayer(name: string): MatchPlayer {
    return {
      name: name,
      points: 0
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

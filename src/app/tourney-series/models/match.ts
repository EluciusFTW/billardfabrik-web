import { MatchPlayer } from './match-player';
import { MatchStatus } from './match-status';
import { PoolDiscipline } from './pool-discipline';

export class Match {
  playerOne: MatchPlayer;
  playerTwo: MatchPlayer;
  discipline: PoolDiscipline;
  length: number;
  status: MatchStatus;
  walk: string;

  constructor(playerOne: MatchPlayer, playerTwo: MatchPlayer, discipline: PoolDiscipline, length: number) {
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.discipline = discipline;
    this.length = length;
    this.walk = MatchPlayer.Walk().name;

    this.status = playerOne.name === this.walk || playerTwo.name === this.walk
      ? MatchStatus.done
      : MatchStatus.notStarted
  }
}

export module Match {
  export function placeHolder(discipline: PoolDiscipline, length: number): Match {
    return new Match(MatchPlayer.Unknown(), MatchPlayer.Unknown(), discipline, length);
  }

  export function looser(match: Match): MatchPlayer {
    return match.playerOne.points === match.length
      ? match.playerTwo
      : match.playerTwo.points === match.length
        ? match.playerOne
        : null;
  }

  export function winner(match: Match): MatchPlayer {
    return match.playerOne.points === match.length || match.playerTwo.name === match.walk
      ? match.playerOne
      : match.playerTwo.points === match.length || match.playerOne.name === match.walk
        ? match.playerTwo
        : null;
  }

  export function hasStarted(match: Match): boolean {
    return match.playerOne.points + match.playerTwo.points > 0;
  }

  export function isOver(match: Match): boolean {
    return match.status === MatchStatus.done
      || match.playerOne.points >= match.length
      || match.playerTwo.points >= match.length;
  }
}

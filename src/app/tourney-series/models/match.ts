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

  static placeHolder(discipline: PoolDiscipline, length: number): Match {
    return new Match(MatchPlayer.Unknown(), MatchPlayer.Unknown(), discipline, length);
  }

  looser(): MatchPlayer {
    return this.playerOne.points === this.length
      ? this.playerTwo
      : this.playerTwo.points === this.length
        ? this.playerOne
        : null;
  }

  winner(): MatchPlayer {
    return this.playerOne.points === this.length || this.playerTwo.name === this.walk
      ? this.playerOne
      : this.playerTwo.points === this.length || this.playerOne.name === this.walk
        ? this.playerTwo
        : null;
  }

  hasStarted(): boolean {
    return this.playerOne.points + this.playerTwo.points > 0;
  }

  isOver(): boolean {
    return this.status === MatchStatus.done
      || this.playerOne.points >= this.length
      || this.playerTwo.points >= this.length;
  }
}

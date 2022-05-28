import { MatchPlayer } from './match-player';
import { MatchStatus } from './match-status';
import { PoolDiscipline } from './pool-discipline';

export class Match {
  playerOne: MatchPlayer;
  playerTwo: MatchPlayer;
  discipline: PoolDiscipline;
  length: number;
  status: MatchStatus;

  constructor(playerOne: MatchPlayer, playerTwo: MatchPlayer, discipline: PoolDiscipline, length: number) {
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.discipline = discipline;
    this.length = length;
    this.status = MatchStatus.notStarted;
  }

  static placeHolder(discipline: PoolDiscipline, length: number): Match{
    return new Match(MatchPlayer.Unknown(), MatchPlayer.Unknown(), discipline, length);
  }

  looser(): MatchPlayer {
    return this.playerOne.points === this.length
    ? this.playerOne
    : this.playerTwo.points === this.length
      ? this.playerTwo
      : null;
  }

  winner(): MatchPlayer {
    return this.playerOne.points === this.length
      ? this.playerOne
      : this.playerTwo.points === this.length
        ? this.playerTwo
        : null;
  }

  hasStarted(): boolean {
    return this.playerOne.points + this.playerTwo.points > 0;
  }

  isOver(): boolean {
    return this.playerOne.points >= this.length || this.playerTwo.points >= this.length;
  }
}

import { MatchPlayer } from './match-player';
import { MatchStatus } from './match-status';
import { PoolDiscipline } from './pool-discipline';

export interface Match {
  playerOne: MatchPlayer;
  playerTwo: MatchPlayer;
  discipline: PoolDiscipline;
  length: number;
  status: MatchStatus;
}

export module Match {

  export function create(playerOne: MatchPlayer, playerTwo: MatchPlayer, discipline: PoolDiscipline, length: number): Match {
    const walkName = MatchPlayer.Walk().name;
    let status = MatchStatus.notStarted;

    if (playerOne.name === walkName) {
      playerTwo.points = length;
      status = MatchStatus.done;
    } else if (playerTwo.name === walkName) {
      playerOne.points = length;
      status = MatchStatus.done;
    }

    return {
      playerOne: playerOne,
      playerTwo: playerTwo,
      discipline: discipline,
      length: length,
      status: status
    }
  }

  export function setPlayerOne(match: Match, player: MatchPlayer) {
    match.playerOne = player;
    handleWalk(match, match.playerOne, match.playerTwo);
  }

  export function setPlayerTwo(match: Match, player: MatchPlayer) {
    match.playerTwo = player;
    handleWalk(match, match.playerTwo, match.playerOne);
  }

  function handleWalk(match: Match, newPlayer: MatchPlayer, otherPlayer: MatchPlayer) {
    if (MatchPlayer.isWalk(newPlayer) && MatchPlayer.isDetermined(otherPlayer)) {
      otherPlayer.points = match.length;
      match.status = MatchStatus.done;
    } else if (MatchPlayer.isDetermined(newPlayer) && MatchPlayer.isWalk(otherPlayer)){
      newPlayer.points = match.length;
      match.status = MatchStatus.done;
    }
  }

  export function placeHolder(discipline: PoolDiscipline, length: number): Match {
    return Match.create(MatchPlayer.Unknown(), MatchPlayer.Unknown(), discipline, length);
  }

  export function loser(match: Match): MatchPlayer {
    return match.playerOne.points === match.length
      ? match.playerTwo
      : match.playerTwo.points === match.length
        ? match.playerOne
        : null;
  }

  export function winner(match: Match): MatchPlayer {
    // This also handles the case that both are walks!
    if (MatchPlayer.isWalk(match.playerTwo)){
      return match.playerOne
    }

    if (MatchPlayer.isWalk(match.playerOne)){
      return match.playerTwo
    }

    return match.playerOne.points === match.length
      ? match.playerOne
      : match.playerTwo.points === match.length
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

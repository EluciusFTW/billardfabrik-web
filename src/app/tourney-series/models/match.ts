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

export function Winner(match: Match) : MatchPlayer {

    return match.playerOne.points === match.length
        ? match.playerOne
        : match.playerTwo.points === match.length
            ? match.playerTwo
            : null;
}

export function Looser(match: Match) : MatchPlayer {

    return match.playerOne.points === match.length
        ? match.playerTwo
        : match.playerTwo.points === match.length
            ? match.playerOne
            : null;
}

export function Started(match: Match) : boolean {
    return match.playerOne.points + match.playerTwo.points > 0;
}

export function IsOver(match: Match) : boolean {
  return match.playerOne.points >= match.length || match.playerTwo.points >= match.length;
}

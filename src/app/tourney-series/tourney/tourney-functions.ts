import { Match } from '../models/match';
import { MatchPlayer } from '../models/match-player';
import { MatchStatus } from '../models/match-status';
import { Tourney } from '../models/tourney';
import { TourneyMode } from '../models/tourney-mode';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';

export class TourneyFunctions {

  public static GetPlayerCount(tourney: Tourney): number {
    return tourney.meta?.numberOfPlayers
      ?? tourney.groups?.flatMap(group => group.players).length
      ?? 0;
  }

  public static GetPlayers(tourney: Tourney): string[] {
    return tourney.meta.modus === 'Gruppe + Einfach-K.O.'
      ? this.GetPlayersFromGroups(tourney)
      : this.GetPlayersFromEntryStage(tourney)
  }

  private static GetPlayersFromEntryStage(tourney: Tourney): string[] {
    return tourney.doubleEliminationStages[0].matches
      .flatMap(match => [MatchPlayer.From(match.playerOne.name), MatchPlayer.From(match.playerTwo.name)])
      .filter(player => MatchPlayer.isReal(player))
      .map(player => player.name);
  }

  private static GetPlayersFromGroups(tourney: Tourney): string[] {
    return tourney.groups?.flatMap(group => group.players) || [];
  }

  public static GetMatches(tourney: Tourney): Match[] {
    let groupMatches = tourney.groups?.flatMap(group => group.matches) || [];
    let doubleEliminationMatches = tourney.doubleEliminationStages?.flatMap(stage => stage.matches) || [];
    let singleeEliminationMatches = tourney.eliminationStages?.flatMap(stage => stage.matches) || [];

    return groupMatches
      .concat(doubleEliminationMatches)
      .concat(singleeEliminationMatches)
  }

  public static GetWinner(tourney: Tourney): string {
    const finalStage = tourney.eliminationStages.filter(stage => stage.type === TourneyEliminationStageType.final)[0];

    return finalStage.status === TourneyPhaseStatus.finalized
      ? Match.winner(finalStage.matches[0]).name
      : ''
  }

  public static GetSecondPlace(tourney: Tourney): string {
    const finalStage = tourney.eliminationStages.filter(stage => stage.type === TourneyEliminationStageType.final)[0];

    return finalStage.status === TourneyPhaseStatus.finalized
      ? Match.loser(finalStage.matches[0]).name
      : ''
  }

  public static GetThirdPlace(tourney: Tourney): string {
    const thirdPlaceStage = tourney.eliminationStages.filter(stage => stage.type === TourneyEliminationStageType.thirdPlace)[0];

    if (thirdPlaceStage?.status !== TourneyPhaseStatus.finalized) {
      return ''
    }

    const thirdPlaceMatch = thirdPlaceStage.matches[0];
    if (thirdPlaceMatch.status === MatchStatus.cancelled) {
      return '** nicht ausgespielt **';
    }

    return Match.winner(thirdPlaceMatch).name;
  }

  public static NameFragmentToDate(dateName: string): Date {
    const year = +dateName.substring(0, 4);
    const month = +dateName.substring(4, 6);
    const day = +dateName.substring(6, 8);
    return new Date(year, month - 1, day);
  }

  public static DateToNameFragment(date: Date) {
    const yy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    return [yy,
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd
    ].join('');
  }
}

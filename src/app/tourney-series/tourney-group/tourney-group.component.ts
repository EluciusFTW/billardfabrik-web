import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GroupStanding } from '../models/group-standing';
import { Match } from '../models/match';
import { MatchPlayer } from "../models/match-player";
import { TourneyGroup } from '../models/tourney-group';
import { TourneyPhaseStatus } from "../models/tourney-phase-status";
import { TourneyPhaseEvent } from '../models/tourney-phase-event';
import { MatchStatus } from '../models/match-status';
import { UserService } from 'src/app/authentication/user.service';
import { GroupFunctions } from './group-functions';

@Component({
  selector: 'app-tourney-group',
  templateUrl: './tourney-group.component.html',
  styleUrls: ['../tourneys.scss']
})
export class TourneyGroupComponent implements OnChanges {

  @Input()
  group: TourneyGroup

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();

  matches = new MatTableDataSource<Match>([]);
  displayedColumnsMatches = ['p1', 'p2', 'score', 'cancel'];

  standing: GroupStanding[] = [];
  totals = new MatTableDataSource<GroupStanding>(this.standing);
  displayedColumnsTotals = ['name', 'games', 'won', 'goals'];

  constructor(private userService: UserService) { }

  ngOnChanges(_: SimpleChanges): void {
    this.matches = new MatTableDataSource<Match>(this.group?.matches);
    this.calculateTotals();
  }

  canFinalize(): boolean {
    return this.userService.canHandleTourneys();
  }

  scoreEditDisabled(match: Match): boolean {
    return this.group.status !== TourneyPhaseStatus.readyOrOngoing
      || match.status === MatchStatus.cancelled;
  }

  cancelled(match: Match): boolean {
    return match.status === MatchStatus.cancelled;
  }

  cancellable(match: Match): boolean {
    return this.group.status !== TourneyPhaseStatus.finalized
      && match.status != MatchStatus.cancelled
      && this.notStarted(match);
  }

  notStarted(match: Match): boolean {
    return !Match.hasStarted(match);
  }

  nooneOverTheHill(match: Match): boolean {
    return !Match.isOver(match);
  }

  uncancellable(match: Match): boolean {
    return this.group.status !== TourneyPhaseStatus.finalized
      && match.status === MatchStatus.cancelled;
  }

  cancel(match: Match): void {
    match.playerOne.points = 0;
    match.playerTwo.points = 0;
    match.status = MatchStatus.cancelled;
    this.change.emit({ type: 'ScoreChanged' });
  }

  uncancel(match: Match): void {
    match.status = MatchStatus.notStarted;
    this.change.emit({ type: 'ScoreChanged' });
  }

  plusDisabled(who: number, match: Match): boolean {
    return who === 1
      ? match.playerOne.points >= match.length || (match.playerTwo.points === match.length && match.playerOne.points === match.length - 1)
      : match.playerTwo.points >= match.length || (match.playerOne.points === match.length && match.playerTwo.points === match.length - 1)
  }

  minusDisabled(who: number, match: Match): boolean {
    return who === 1
      ? match.playerOne.points === 0
      : match.playerTwo.points === 0;
  }

  getMatchClass(match: Match): string {
    if (this.group.status === TourneyPhaseStatus.finalized) {
      return '';
    } else if (match.status === MatchStatus.cancelled) {
      return 'cancelled';
    } else if (this.notStarted(match)) {
      return 'notStarted';
    } else if (this.nooneOverTheHill(match)) {
      return 'running';
    }
    return 'gameOver';
  }

  getStandingClass(standing: GroupStanding): string {
    return this.standing.map(s => s.name).slice(0, 2).includes(standing.name)
      ? 'running'
      : '';
  }

  plus(player: MatchPlayer): void {
    player.points++;
    this.change.emit({ type: 'ScoreChanged' });
  }

  minus(player: MatchPlayer): void {
    player.points--;
    this.change.emit({ type: 'ScoreChanged' });
  }

  allGamesOver(): boolean {
    return this.group.matches
      .filter(match => match.status !== MatchStatus.cancelled)
      .findIndex(match => !Match.isOver(match)) === -1;
  }

  finalize(): void {
    if (!this.allGamesOver()) {
      return;
    }

    this.group.status = TourneyPhaseStatus.finalized;
    this.group.matches
      .filter(match => match.status !== MatchStatus.cancelled)
      .forEach(match => match.status = MatchStatus.done);

    this.group.qualified = this.standing
      .slice(0, 2)
      .map(row => row.name);

    this.change.emit({ type: 'GroupFinalized' });
  }

  private calculateTotals(): void {
    this.standing = GroupFunctions.calculcateStanding(this.group);
    this.totals = new MatTableDataSource<GroupStanding>(GroupFunctions.calculcateStanding(this.group));
  }
}

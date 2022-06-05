import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GroupStanding } from '../models/group-standing';
import { Match } from '../models/match';
import { MatchPlayer } from "../models/match-player";
import { TourneyGroup } from '../models/tourney-group';
import { TourneyPhaseStatus } from "../models/tourney-phase-status";
import { GroupFinalizedEvent, ScoreChangedEvent, TourneyPhaseEvent } from '../models/tourney-phase-event';
import { TourneyStandingCalculationService } from '../services/tourney-standing-calculation.service';
import { MatchStatus } from '../models/match-status';
// import { UserService } from 'src/app/authenticated-area/user.service';

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

  constructor(
    private standingsCalculator: TourneyStandingCalculationService,
    // private userService: UserService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    this.matches = new MatTableDataSource<Match>(this.group?.matches);
    this.calculateTotals();
  }

  canFinalize(): boolean {
    return true;
    // return this.userService.canHandleTourneys();
  }

  scoreEditDisabled(match: Match): boolean {
    return this.group.status !== TourneyPhaseStatus.readyOrOngoing
      || match.status === MatchStatus.cancelled;
  }

  cancelled(match: Match) {
    return match.status === MatchStatus.cancelled;
  }

  cancellable(match: Match): boolean {
    return this.group.status !== TourneyPhaseStatus.finalized
      && match.status != MatchStatus.cancelled
      && this.notStarted(match);
  }

  notStarted(match: Match): boolean {
    return match.playerOne.points + match.playerTwo.points === 0;
  }

  nooneOverTheHill(match: Match): boolean {
    return match.playerOne.points < match.length
      && match.playerTwo.points < match.length;
  }

  uncancellable(match: Match): boolean {
    return this.group.status !== TourneyPhaseStatus.finalized
      && match.status === MatchStatus.cancelled;
  }

  cancel(match: Match): void {
    match.playerOne.points = 0;
    match.playerTwo.points = 0;
    match.status = MatchStatus.cancelled;
    this.calculateTotals();
    this.change.emit({type: 'ScoreChanged'});
  }

  uncancel(match: Match): void {
    match.status = MatchStatus.notStarted;
    this.change.emit({type: 'ScoreChanged'});
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

  getStandingClass(standing: GroupStanding) {
    return this.standing.map(s => s.name).slice(0, 2).includes(standing.name)
      ? 'running'
      : '';
  }

  plus(player: MatchPlayer): void {
    player.points++;
    this.calculateTotals();
    this.change.emit({type: 'ScoreChanged'});
  }

  minus(player: MatchPlayer): void {
    player.points--;
    this.calculateTotals();
    this.change.emit({type: 'ScoreChanged'});
  }

  allGamesOver(): boolean {
    return this.group.matches
      .filter(match => match.status !== MatchStatus.cancelled)
      .findIndex(match => !match.isOver()) === -1;
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

    this.change.emit({type: 'GroupFinalized'});
  }

  private calculateTotals(): void {
    this.standing = this.standingsCalculator.calculcateStanding(this.group);
    this.totals = new MatTableDataSource<GroupStanding>(this.standingsCalculator.calculcateStanding(this.group));
  }
}

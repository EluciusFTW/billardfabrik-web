import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GroupStanding } from '../models/group-standing';
import { Match } from '../models/match';
import { TourneyGroup } from '../models/tourney-group';
import { TourneyPhaseStatus } from "../models/tourney-phase-status";
import { TourneyPhaseEvent } from '../models/tourney-phase-event';
import { MatchStatus } from '../models/match-status';
import { UserService } from 'src/app/authentication/user.service';
import { GroupFunctions } from './group-functions';

@Component({
  selector: 'app-tourney-group',
  templateUrl: './tourney-group.component.html',
  styleUrls: ['../tourneys.scss', './tourney-group.component.scss']
})
export class TourneyGroupComponent implements OnInit {

  @Input({ required: true })
  group: TourneyGroup

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();
  displayedColumnsMatches = ['p1', 'p2', 'score', 'cancel'];

  standing: GroupStanding[] = [];
  totals = new MatTableDataSource<GroupStanding>(this.standing);
  displayedColumnsTotals = ['name', 'games', 'won', 'goals'];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.calculateTotals();
  }

  emitChange($event: TourneyPhaseEvent): void {
    this.calculateTotals();
    this.change.emit($event);
  }

  get canFinalize(): boolean {
    return this.userService.canHandleTourneys();
  }

  getStandingClass(standing: GroupStanding): string {
    return this.standing
      .map(s => s.name)
      .slice(0, 2)
      .includes(standing.name)
        ? 'running'
        : '';
  }

  get groupActive() {
    return this.group.status === TourneyPhaseStatus.readyOrOngoing;
  }

  get groupCompleted() {
    return this.group.status == TourneyPhaseStatus.finalized;
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

    this.group.qualified = GroupFunctions
      .calculcateStanding(this.group)
      .slice(0, 2)
      .map(row => row.name);

    this.change.emit({ type: 'GroupFinalized' });
  }

  private calculateTotals(): void {
    this.standing = GroupFunctions.calculcateStanding(this.group);
    this.totals = new MatTableDataSource<GroupStanding>(GroupFunctions.calculcateStanding(this.group));
  }
}

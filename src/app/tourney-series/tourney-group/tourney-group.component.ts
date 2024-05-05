import { Component, EventEmitter, Output, computed, effect, inject, input } from '@angular/core';
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
export class TourneyGroupComponent {
  private userService = inject(UserService);

  group = input.required<TourneyGroup>();

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();
  displayedColumnsMatches = ['p1', 'p2', 'score', 'cancel'];

  standing = computed(() => GroupFunctions.calculcateStanding(this.group()));
  groupActive = computed(() => this.group().status === TourneyPhaseStatus.readyOrOngoing);
  groupCompleted = computed(() => this.group().status == TourneyPhaseStatus.finalized);
  allGamesOver = computed(() =>
    this.group().matches
      .filter(match => match.status !== MatchStatus.cancelled)
      .findIndex(match => !Match.isOver(match)) === -1);

  totals = new MatTableDataSource<GroupStanding>([]);
  displayedColumnsTotals = ['name', 'games', 'won', 'goals'];

  calcTotals = effect(() => this.totals = new MatTableDataSource<GroupStanding>(this.standing()));

  emitChange($event: TourneyPhaseEvent): void {
    this.change.emit($event);
  }

  get canFinalize(): boolean {
    return this.userService.canHandleTourneys();
  }

  finalize(): void {
    if (!this.allGamesOver()) {
      return;
    }

    this.group().status = TourneyPhaseStatus.finalized;
    this.group().matches
      .filter(match => match.status !== MatchStatus.cancelled)
      .forEach(match => match.status = MatchStatus.done);

    this.group().qualified = GroupFunctions
      .calculcateStanding(this.group())
      .slice(0, 2)
      .map(row => row.name);

    this.change.emit({ type: 'GroupFinalized' });
  }
}

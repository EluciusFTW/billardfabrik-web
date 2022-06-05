import { Component, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Match } from '../models/match';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { MatchPlayer } from '../models/match-player';
import { DoubleEliminationStageFinalizedEvent, ScoreChangedEvent, SingleEliminationStageFinalizedEvent, TourneyPhaseEvent } from '../models/tourney-phase-event';
// import { UserService } from 'src/app/authenticated-area/user.service';
import { MatchStatus } from '../models/match-status';
import { TourneyEliminationStage } from '../models/tourney-elimination-stage';
import { TourneyEliminationStageType } from '../models/tourney-single-elimination-stage-type';
import { TourneyDoubleEliminationStageType } from '../models/tourney-double-elimination-stage-type';

@Component({
  selector: 'app-tourney-elimination-stage',
  templateUrl: './tourney-elimination-stage.component.html',
  styleUrls: ['../tourneys.scss']
})
export class TourneyEliminationStageComponent {

  @Input()
  stage: TourneyEliminationStage

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();

  // this.stage?.matches
  matches = new MatTableDataSource<Match>([]);
  displayedColumnsMatches = ['p1', 'p2', 'score'];

  // constructor(private userService: UserService) { }

  ngOnChanges(_: SimpleChanges) {
    this.matches = new MatTableDataSource<Match>(this.stage?.matches);
  }

  scoreEditDisabled(): boolean {
    return false;
    // return this.stage.status !== TourneyPhaseStatus.readyOrOngoing;
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

  increaseLength(): void {
    this.stage.matches.forEach(match => match.length++);
  }

  decreaseLength(): void {
    this.stage.matches.forEach(match => match.length--);
  }

  plus(player: MatchPlayer): void {
    player.points++;
    this.change.emit({type: 'ScoreChanged'});
  }

  minus(player: MatchPlayer): void {
    player.points--;
    this.change.emit({type: 'ScoreChanged'});
  }

  allGamesOver(): boolean {
    return this.stage.matches
      .filter(match => match.status !== MatchStatus.cancelled)
      .findIndex(match => !match.isOver()) === -1;
  }

  finalize(): void {
    if (!this.allGamesOver()) {
      return;
    }

    this.stage.status = TourneyPhaseStatus.finalized;
    this.stage.matches
      .filter(match => match.status !== MatchStatus.cancelled)
      .forEach(match => match.status = MatchStatus.done);

    const event = this.stage.eliminationType == 'Single'
      ? ({
        type: 'SingleEliminationStageFinalized',
        stage: this.stage.type as TourneyEliminationStageType
      })
      : ({
        type: 'DoubleEliminationStageFinalized',
        stage: this.stage.type as TourneyDoubleEliminationStageType
      })

    this.change.emit(event as TourneyPhaseEvent);
  }

  canHandleTourney(): boolean {
    return true;
    // return this.userService.canHandleTourneys();
  }

  getMatchClass(match: Match): string {
    if (this.stage.status === TourneyPhaseStatus.finalized) {
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

  notStarted(match: Match): boolean {
    return !match.hasStarted();
  }

  nooneOverTheHill(match: Match): boolean {
    return !match.isOver();
  }
}

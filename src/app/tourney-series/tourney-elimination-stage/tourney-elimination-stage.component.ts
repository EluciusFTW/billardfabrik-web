import { Component, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { TourneyEliminationStage, TourneyEliminationStageType } from '../models/Tourney-elimination-stage';
import { MatTableDataSource } from '@angular/material/table';
import { Match } from '../models/match';
import { TourneyPhaseStatus } from '../models/tourney-phase-status';
import { MatchPlayer } from '../models/match-player';
import { TourneyPhaseEvent } from '../models/tourney-phase-event';
import { UserService } from 'src/app/authenticated-area/user.service';
import { MatchStatus } from '../models/match-status';

@Component({
  selector: 'app-tourney-elimination-stage',
  templateUrl: './tourney-elimination-stage.component.html',
  styleUrls: ['./tourney-elimination-stage.component.scss']
})
export class TourneyEliminationStageComponent {

  @Input()
  stage: TourneyEliminationStage

  @Output()
  change: EventEmitter<any> = new EventEmitter();

  matches = new MatTableDataSource<Match>(this.stage?.matches);
  displayedColumnsMatches = ['p1', 'p2', 'score'];

  constructor(private userService: UserService) { }

  name(): string {
    switch (this.stage.type) {
      case TourneyEliminationStageType.eigthFinal: return "Achtelfinale";
      case TourneyEliminationStageType.quarterFinal: return "ViertelFinale";
      case TourneyEliminationStageType.semiFinal: return "Halbfinale";
      case TourneyEliminationStageType.thirdPlace: return "Spiel um Platz 3";
      case TourneyEliminationStageType.final: return "Finale";
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.matches = new MatTableDataSource<Match>(this.stage?.matches);
  }

  scoreEditDisabled(): boolean {
    return this.stage.status !== TourneyPhaseStatus.readyOrOngoing;
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
    this.change.emit(TourneyPhaseEvent.scoreChanged);
  }

  minus(player: MatchPlayer): void {
    player.points--;
    this.change.emit(TourneyPhaseEvent.scoreChanged);
  }

  allGamesOver(): boolean {
    return this.stage.matches
      .filter(match => match.status !== MatchStatus.cancelled)
      .findIndex(match => match.playerOne.points < match.length && match.playerTwo.points < match.length) === -1;
  }

  finalize(): void {
    if (!this.allGamesOver()) {
      return;
    }

    this.stage.status = TourneyPhaseStatus.finalized;
    this.stage.matches
      .filter(match => match.status !== MatchStatus.cancelled)
      .forEach(match => match.status = MatchStatus.done);

    this.change.emit(TourneyPhaseEvent.eliminationStageFinalized);
  }

  canHandleTourney(): boolean {
    return this.userService.canHandleTourneys();
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
    return match.playerOne.points + match.playerTwo.points === 0;
  }

  nooneOverTheHill(match: Match): boolean {
    return match.playerOne.points < match.length
      && match.playerTwo.points < match.length;
  }
}
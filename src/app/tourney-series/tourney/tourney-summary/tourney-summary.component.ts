import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyStatus, TourneyStatusMapper } from '../../models/tourney-status';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';
import { PoolDisciplineMapper } from '../../models/pool-discipline';
import { TourneyEvaluationService } from '../../services/tourney-evaluation-service';
import { TourneyStatisticsService } from '../../services/tourney-statistics.service';
import { PlayersService } from '../../services/players.service';
import { TourneyPhaseStatus } from '../../models/tourney-phase-status';
import { MatDialog } from '@angular/material/dialog';
import { TourneyGroupStageAddPlayerDialogComponent } from '../tourney-group-stage/tourney-group-stage-add-player-dialog.component';
import { TourneyGroup } from '../../models/tourney-group';
import { Match } from '../../models/match';
import { MatchStatus } from '../../models/match-status';
// import { UserService } from 'src/app/authenticated-area/user.service';

@Component({
  selector: 'app-tourney-summary',
  templateUrl: './tourney-summary.component.html',
  styleUrls: ['./tourney-summary.component.scss']
})
export class TourneySummaryComponent {

  @Input()
  tourney: Tourney;

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();

  private _mapper = new TourneyStatusMapper();

  constructor(
    private evaluationService: TourneyEvaluationService,
    private statisticsService: TourneyStatisticsService,
    private playersService: PlayersService,
    public dialog: MatDialog,
    // private userService: UserService
  ) { }

  addPlayer(): void {
    const dialogRef = this.dialog.open(TourneyGroupStageAddPlayerDialogComponent, {
      data: {},
      width: '300px',
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe(
      name => {
        if (name) {
          this.inject(name)
        }
      }
    )
  }

  inject(name: any) {
    let group = this.chooseRandomGroup()
    this.addMatches(name, group);
    group.players.push(name);
    this.change.emit(TourneyPhaseEvent.scoreChanged);
  }

  chooseRandomGroup(): TourneyGroup {
    var smallestGroupsize = this.tourney.groups.map(group => group.players.length).sort()[0];
    const viableGroups = this.tourney.groups.filter(group => group.players.length === smallestGroupsize);
    let chosenGroup = viableGroups[Math.floor(Math.random() * viableGroups.length)];

    return chosenGroup;
  }

  addMatches(newPlayerName: any, group: TourneyGroup) {
    var referenceMatch = group.matches[0];
    const matches = group.players
      .map(player => <Match>
      {
        playerOne: { name: newPlayerName, points: 0 },
        playerTwo: { name: player, points: 0 },
        discipline: referenceMatch.discipline,
        length: referenceMatch.length,
        status: MatchStatus.notStarted
      });
    group.matches.push(...matches);
  }

  displayStatus(): string {
    return this.tourney
      ? this._mapper.map(this.tourney.meta.status)
      : 'Loading ...';
  }

  canAddPlayers(): boolean {
    return true;
    // return this.userService.canHandleTourneys();
  }

  getDiscipline() {
    return new PoolDisciplineMapper().map(this.tourney?.meta?.discipline);
  }

  getWinner(): string {
    return this.evaluationService.GetWinner(this.tourney);
  }

  getSecondPlace(): string {
    return this.evaluationService.GetSecondPlace(this.tourney);
  }

  getThirdPlace(): string {
    return this.evaluationService.GetThirdPlace(this.tourney);
  }

  getCount(): number {
    return this.evaluationService.GetPlayerCount(this.tourney);
  }

  calculate(): void {
    if (this.tourney.meta.status !== TourneyStatus.postProcessed) {
      var result = this.statisticsService.Evaluate(this.tourney);
      if (result) {
        result.players.forEach(evaluation => this.playersService.AddPlayerRecord(evaluation));
      }
      this.change.emit(TourneyPhaseEvent.resultsPostProcessed);
    }
  }

  someGroupFinished(): boolean {
    return this.tourney.groups.some(group => group.status === TourneyPhaseStatus.finalized)
  }

  canStart(): boolean {
    return true;
    // return this.userService.canHandleTourneys();
  }

  canCompute(): boolean {
    return true;
    // return this.userService.isAdmin() && this.tourney.meta.status !== TourneyStatus.postProcessed;
  }

  start() {
    this.change.emit(TourneyPhaseEvent.started);
  }
}

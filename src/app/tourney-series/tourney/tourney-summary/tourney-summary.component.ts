import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Tourney } from '../../models/tourney';
import { TourneyStatus, TourneyStatusMapper } from '../../models/tourney-status';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';
import { PoolDisciplineMapper } from '../../models/pool-discipline';
import { TourneyEvaluationService } from '../../services/tourney-evaluation-service';
import { TourneyStatisticsService } from '../../services/tourney-statistics.service';
import { PlayersService } from '../../services/players.service';
import { UserService } from 'src/app/authenticated-area/user.service';

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
    private userService: UserService
  ) { }

  displayStatus(): string {
    return this.tourney
      ? this._mapper.map(this.tourney.meta.status)
      : 'Loading ...';
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

  canStart(): boolean {
    return this.userService.canHandleTourneys();
  }

  canCompute(): boolean {
    return this.userService.isAdmin() && this.tourney.meta.status !== TourneyStatus.postProcessed;
  }

  start() {
    this.change.emit(TourneyPhaseEvent.started);
  }
}

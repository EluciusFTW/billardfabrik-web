import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourneysService } from '../services/tourneys.service';
import { Tourney } from '../models/tourney';
import { Subscription } from 'rxjs';
import { TourneyPhaseEvent } from '../models/tourney-phase-event';
import { TourneyFunctions } from './tourney-functions';

@Component({
  selector: 'app-tourney',
  templateUrl: './tourney.component.html'
})
export class TourneyComponent {

  id: string;
  tourney: Tourney;

  constructor(private route: ActivatedRoute, private tourneysService: TourneysService) {
    this.tourneysService
      .get(this.route.snapshot.paramMap.get('id'))
      .subscribe(tourney => this.tourney = tourney);
  }

  get header(): string {
    return this.tourney
      ? `${this.tourney.meta.name} Nr. ${this.tourney.meta.occurrence}`
      : 'Loading ...'
  }

  get subheader(): string {
    return this.tourney
      ? `vom ${TourneyFunctions.NameFragmentToDate(this.tourney.meta.date).toLocaleDateString()}`
      : ''
  }

  get hasGroupStage(): boolean {
    return (this.tourney?.groups?.length ?? 0) > 0;
  }

  get hasDoubleEliminationStage(): boolean {
    return (this.tourney?.doubleEliminationStages?.length ?? 0) > 0
  }

  get hasSingleEliminationStage(): boolean {
    return (this.tourney?.eliminationStages?.length ?? 0) > 0
  }

  update(event: TourneyPhaseEvent): void {
    this.tourneysService.update(this.tourney, event);
  }
}

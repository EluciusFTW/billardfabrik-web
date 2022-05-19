import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourneysService } from '../services/tourneys.service';
import { Tourney } from '../models/tourney';
import { Subscription } from 'rxjs';
import { TourneyPhaseEvent } from '../models/tourney-phase-event';

@Component({
  selector: 'app-tourney',
  templateUrl: './tourney.component.html'
})
export class TourneyComponent implements OnDestroy {

  id: string;
  private sub: Subscription;
  tourney: Tourney;

  constructor(private route: ActivatedRoute, private tourneysService: TourneysService) {
    this.sub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this.tourneysService
          .get(this.id)
          .subscribe(tourney => this.tourney = tourney);
      });
  }

  hasGroupStage(): boolean {
    return (this.tourney?.groups?.length ?? 0) > 0;
  }

  hasDoubleEliminationStage(): boolean{
    return (this.tourney?.doubleEliminationStages?.length ?? 0) > 0
  }

  hasSingleEliminationStage(): boolean{
    return (this.tourney?.eliminationStages?.length ?? 0) > 0
  }


  update(event: TourneyPhaseEvent): void {
    this.tourneysService.update(this.tourney, event);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

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
        this.tourneysService.get(this.id).subscribe(
          tourney => this.tourney = tourney
        );
      });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

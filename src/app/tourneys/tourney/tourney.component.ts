import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourneysService } from '../services/tourneys.service';
import { Tourney } from '../models/tourney';
import { Subscription } from 'rxjs';
import { TourneyPhaseEvent } from '../models/tourney-phase-event';

@Component({
  selector: 'app-tourney',
  templateUrl: './tourney.component.html',
  styleUrls: ['./tourney.component.scss']
})
export class TourneyComponent implements OnDestroy {

  id: string;
  private sub: Subscription;
  tourney: Tourney;

  showGroup = false;
  showElimination = false;

  constructor(private route: ActivatedRoute, private tourneysService: TourneysService) {
    this.sub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this.tourneysService.get(this.id).subscribe(
          tourney => this.tourney = tourney
        );
      });
  }

  update(event: TourneyPhaseEvent): void {
    this.tourneysService.update(this.tourney, event);
  }

  activate(what: string): void {
    if (what === 'group') {
      this.showGroup = true;
      this.showElimination = false;
    } else if (what === 'elimination') {
      this.showGroup = false;
      this.showElimination = true;
    } else {
      this.showGroup = false;
      this.showElimination = false;
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

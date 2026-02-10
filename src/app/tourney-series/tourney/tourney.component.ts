import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { TourneysService } from '../services/tourneys.service';
import { Tourney } from '../models/tourney';
import { TourneyPhaseEvent } from '../models/tourney-phase-event';
import { TourneyFunctions } from './tourney-functions';
import { MaterialModule } from 'src/app/material/material.module';
import { ContentTileComponent } from 'src/app/shared/content-tile/content-tile.component';
import { TourneyGroupStageComponent } from './tourney-group-stage/tourney-group-stage.component';
import { TourneyDoubleEliminationStagesComponent } from './tourney-double-elimination-stage/tourney-double-elimination-stages.component';
import { TourneySummaryComponent } from './tourney-summary/tourney-summary.component';
import { TourneyEliminationStagesComponent } from "./tourney-elimination-stage/tourney-elimination-stages.component";

@Component({
  selector: 'app-tourney',
  templateUrl: './tourney.component.html',
  imports: [MaterialModule, ContentTileComponent, TourneyGroupStageComponent, TourneyDoubleEliminationStagesComponent, TourneySummaryComponent, TourneyEliminationStagesComponent]
})
export class TourneyComponent implements OnInit {

  private tourneysService = inject(TourneysService);
  public id = input.required<string>();

  tourney = signal<Tourney | null>(null);
  header = computed(() => this.tourney()
    ? `${this.tourney().meta.name} Nr. ${this.tourney().meta.occurrence}`
    : 'Loading ... ');
  subheader = computed(() => this.tourney()
    ? `vom ${TourneyFunctions.NameFragmentToDate(this.tourney().meta.date).toLocaleDateString()}`
    : '');
  hasGroupStage = computed(() => this.tourney()?.meta.modus === 'Gruppe + Einfach-K.O.');
  hasSingleEliminationStage = computed(() => (this.tourney()?.eliminationStages?.length ?? 0) > 0);
  hasDoubleEliminationStage = computed(() => this.tourney()?.meta.modus === 'Doppel-K.O.');

  ngOnInit() {
    this.tourneysService
      .get(this.id())
      .subscribe(id => this.tourney.set(id));
  }

  update(event: TourneyPhaseEvent): void {
    this.tourneysService.update(this.tourney(), event);
  }
}

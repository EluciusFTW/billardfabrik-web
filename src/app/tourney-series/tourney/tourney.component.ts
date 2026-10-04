import { Component, OnInit, computed, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { TourneysService } from '../services/tourneys.service';
import { Tourney } from '../models/tourney';
import { TourneyPhaseEvent } from '../models/tourney-phase-event';
import { TourneyFunctions } from './tourney-functions';
import { ContentTileComponent } from '../../shared/content-tile/content-tile.component';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { TourneySummaryComponent } from './tourney-summary/tourney-summary.component';
import { TourneyGroupStageComponent } from './tourney-group-stage/tourney-group-stage.component';
import { TourneyDoubleEliminationStagesComponent } from './tourney-double-elimination-stage/tourney-double-elimination-stages.component';
import { TourneyEliminationStagesComponent } from './tourney-elimination-stage/tourney-elimination-stages.component';

@Component({
  selector: 'app-tourney',
  templateUrl: './tourney.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent, MatTabGroup, MatTab, TourneySummaryComponent, TourneyGroupStageComponent, TourneyDoubleEliminationStagesComponent, TourneyEliminationStagesComponent]
})
export class TourneyComponent implements OnInit {

  private tourneysService = inject(TourneysService);
  public id = input.required<string>();
  public unique = input(false);

  tourney = signal<Tourney | null>(null);
  header = computed(() => this.tourney()
    ? this.tourney().meta.occurrence
      ? `${this.tourney().meta.name} Nr. ${this.tourney().meta.occurrence}`
      : this.tourney().meta.name
    : 'Loading ... ');
  subheader = computed(() => this.tourney()
    ? `vom ${TourneyFunctions.NameFragmentToDate(this.tourney().meta.date).toLocaleDateString()}`
    : '');
  hasGroupStage = computed(() => this.tourney()?.meta.modus === 'Gruppe + Einfach-K.O.');
  hasSingleEliminationStage = computed(() => (this.tourney()?.eliminationStages?.length ?? 0) > 0);
  hasDoubleEliminationStage = computed(() => this.tourney()?.meta.modus === 'Doppel-K.O.');

  ngOnInit() {
    this.tourneysService
      .get(this.id(), this.unique())
      .subscribe(id => this.tourney.set(id));
  }

  update(event: TourneyPhaseEvent): void {
    this.tourneysService.update(this.tourney(), event);
  }
}

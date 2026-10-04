import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ContentTileComponent } from '../../shared/content-tile/content-tile.component';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { ImportSingleMatchComponent } from './import-single-match/import-single-match.component';
import { ImportTourneyComponent } from './import-tourney/import-tourney.component';
import { ImportAdHocTourneyComponent } from './import-ad-hoc-tourney/import-ad-hoc-tourney.component';

@Component({
  templateUrl: './import-matches.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent, MatTabGroup, MatTab, ImportSingleMatchComponent, ImportTourneyComponent, ImportAdHocTourneyComponent]
})
export class ImportMatchesComponent { }

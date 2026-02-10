import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';
import { ContentTileComponent } from 'src/app/shared/content-tile/content-tile.component';
import { ImportTourneyComponent } from './import-tourney/import-tourney.component';
import { ImportSingleMatchComponent } from './import-single-match/import-single-match.component';

@Component({
  templateUrl: './import-matches.component.html',
  imports: [MaterialModule, ContentTileComponent, ImportSingleMatchComponent, ImportTourneyComponent]
})
export class ImportMatchesComponent { }

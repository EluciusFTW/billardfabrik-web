import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ContentTileComponent } from '../shared/content-tile/content-tile.component';

@Component({
  templateUrl: 'league.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent],
})
export class LeagueComponent { }

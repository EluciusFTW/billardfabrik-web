import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ContentTileComponent } from '../shared/content-tile/content-tile.component';

@Component({
  templateUrl: 'training.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent],
})
export class TrainingComponent { }

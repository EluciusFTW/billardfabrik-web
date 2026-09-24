import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ContentTileComponent } from '../shared/content-tile/content-tile.component';

@Component({
  templateUrl: './mensa.component.html',
  styles: [`
    .mensa-logo {
      height: 90px;
      float: right;
      padding: 1em;
    }`],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ContentTileComponent]
})
export class MensaComponent { }

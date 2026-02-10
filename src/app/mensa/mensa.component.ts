import { Component } from '@angular/core';
import { ContentTileComponent } from '../shared/content-tile/content-tile.component';

@Component({
  templateUrl: './mensa.component.html',
  styles: [`
    .mensa-logo {
      height: 90px;
      float: right;
      padding: 1em;
    }`],
  imports: [ContentTileComponent]
})
export class MensaComponent { }

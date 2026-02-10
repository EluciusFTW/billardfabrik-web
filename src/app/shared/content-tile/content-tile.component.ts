import { Component, input, Input } from '@angular/core';

@Component({
    selector: 'app-content-tile',
    templateUrl: './content-tile.component.html',
    styleUrls: ['./content-tile.component.scss'],
    standalone: false
})
export class ContentTileComponent {
  public header = input<string>();
  public subheader = input<string>();
}

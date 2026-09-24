import { Component, input, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-content-tile',
  templateUrl: './content-tile.component.html',
  styleUrls: ['./content-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ContentTileComponent {
  public header = input<string>();
  public subheader = input<string>();
}

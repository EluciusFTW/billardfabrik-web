import { Component, input, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-content-tile',
  templateUrl: './content-tile.component.html',
  styleUrls: ['./content-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent]
})
export class ContentTileComponent {
  public header = input<string>();
  public subheader = input<string>();
}

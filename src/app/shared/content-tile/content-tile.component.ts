import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-content-tile',
  templateUrl: './content-tile.component.html',
  styleUrls: ['./content-tile.component.scss']
})
export class ContentTileComponent {

  @Input()
  header: string;

  @Input()
  content: string;

  @Input()
  link: string;

  @Input()
  type: '';
}

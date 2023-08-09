import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html'
})
export class ContentHeaderComponent {
  @Input()
  header: string;

  @Input()
  size: number;

  @Input()
  icon: string;

  classExpr(): string {
    return !this.icon
      ? `fa fa-${this.icon}`
      : '';
  }
}

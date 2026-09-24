import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  templateUrl: './mensa.component.html',
  styles: [`
    .mensa-logo {
      height: 90px;
      float: right;
      padding: 1em;
    }`],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [SharedModule]
})
export class MensaComponent { }

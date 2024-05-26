import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  templateUrl: './mensa.component.html',
  styles: [`
    .mensa-logo {
      height: 90px;
      float: right;
      padding: 1em;
    }`],
    imports: [SharedModule],
    standalone: true
})
export class MensaComponent { }

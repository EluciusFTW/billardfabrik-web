import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  templateUrl: './about.component.html',
  imports: [SharedModule],
  standalone: true
})
export class AboutComponent { }

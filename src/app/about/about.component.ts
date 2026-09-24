import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SharedModule]
})
export class AboutComponent { }

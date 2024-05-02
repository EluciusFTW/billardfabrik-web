import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  templateUrl: 'training.component.html',
  imports: [SharedModule],
  standalone: true,
})
export class TrainingComponent { }

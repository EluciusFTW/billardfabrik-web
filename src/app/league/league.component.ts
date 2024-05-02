import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  templateUrl: 'league.component.html',
  imports: [SharedModule],
  standalone: true,
})
export class LeagueComponent { }

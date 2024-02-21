import { Component } from '@angular/core';
import { AuthorizedComponent } from 'src/app/shared/authorized.component';

@Component({
  templateUrl: './tourney-list.component.html',
  styleUrls: ['./tourney-list.component.scss']
})
export class TourneyListComponent extends AuthorizedComponent {
  get isTourneyAuthenticated(): boolean {
    return this.userService.canHandleTourneys();
  }
}

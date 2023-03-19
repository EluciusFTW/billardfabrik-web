import { Component } from '@angular/core';
import { UserService } from 'src/app/authentication/user.service';

@Component({
  templateUrl: './tourney-list.component.html',
  styleUrls: ['./tourney-list.component.scss']
})
export class TourneyListComponent {

  constructor(private userService: UserService) {  }

  isTourneyAuthenticated(): boolean {
    return this.userService.canHandleTourneys();
  }
}

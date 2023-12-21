import { Component } from '@angular/core';
import { UserService } from '../authentication/user.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent {

  constructor(private readonly userService: UserService) {}

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  publicTabs = [
    { link: 'players', label: 'Rangliste' },
    { link: 'matches', label: 'Matches' },
    { link: 'details', label: 'Details' },
  ]

  activeLink = "players";
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent {
  tabs = [
    { link: 'players', label: 'Rangliste' },
    { link: 'matches', label: 'Matches' },
  ]

  activeLink = "players";
}

import { Component } from '@angular/core';
import { AuthorizedComponent } from '../shared/authorized.component';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent extends AuthorizedComponent {

  publicTabs = [
    { link: 'players', label: 'Rangliste' },
    { link: 'matches', label: 'Matches' },
    { link: 'details', label: 'Details' }
  ] as const;


  authenticatedTabs = [
    { link: 'import', label: 'Import' },
    { link: 'player-management', label: 'Spielerverwaltung' }
  ] as const;

  activeLink = "players";
}

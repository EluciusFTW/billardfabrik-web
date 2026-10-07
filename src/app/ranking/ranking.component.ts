import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthorizedComponent } from '../shared/authorized.component';
import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatTabNav, MatTabLink, RouterLink, MatTabNavPanel, RouterOutlet]
})
export class RankingComponent extends AuthorizedComponent {

  publicTabs = [
    { link: 'players', label: 'Rangliste' },
    { link: 'matches', label: 'Matches' },
    { link: 'challenges', label: 'Challenges' },
    { link: 'details', label: 'Details' }
  ] as const;


  authenticatedTabs = [
    { link: 'import', label: 'Import' },
    { link: 'player-management', label: 'Spielerverwaltung' }
  ] as const;

  activeLink = "players";
}

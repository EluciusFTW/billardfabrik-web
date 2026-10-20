import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ContentTileComponent } from '../../shared/content-tile/content-tile.component';

// Groups the views on the ranking itself as sub-tabs of the 'Rangliste' tab.
@Component({
  templateUrl: './ranking-overview.component.html',
  styleUrls: ['./ranking-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent, MatTabNav, MatTabLink, RouterLink, RouterLinkActive, MatTabNavPanel, RouterOutlet]
})
export class RankingOverviewComponent {
  tabs = [
    { link: 'players', label: 'Rangliste' },
    { link: 'matches', label: 'Matches' },
    { link: 'vs', label: 'Vs' }
  ] as const;
}

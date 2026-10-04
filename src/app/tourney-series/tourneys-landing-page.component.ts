import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ContentTileComponent } from '../shared/content-tile/content-tile.component';
import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tourneys-landing-page',
  templateUrl: './tourneys-landing-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent, MatTabNav, MatTabLink, RouterLink, MatTabNavPanel, RouterOutlet]
})
export class TourneysLandingPageComponent {
  tabs = [
    { link: 'overview', label: 'Details' },
    { link: 'list', label: 'Turnierserie' },
    { link: 'unique', label: 'Einzelne Turniere' },
    { link: 'leaderboard', label: 'Leaderboards' }
  ]

  activeLink = "overview";
}

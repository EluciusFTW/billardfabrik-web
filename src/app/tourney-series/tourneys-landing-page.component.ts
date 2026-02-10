import { Component } from '@angular/core';
import { ContentTileComponent } from '../shared/content-tile/content-tile.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tourneys-landing-page',
  templateUrl: './tourneys-landing-page.component.html',
  imports: [MaterialModule, RouterModule, ContentTileComponent]
})
export class TourneysLandingPageComponent {
  tabs = [
    { link: 'overview', label: 'Details' },
    { link: 'list', label: 'Turniere' },
    { link: 'leaderboard', label: 'Leaderboards' }
  ]

  activeLink = "overview";
}

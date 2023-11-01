import { Component } from '@angular/core';

@Component({
  selector: 'app-tourneys-landing-page',
  templateUrl: './tourneys-landing-page.component.html'
})
export class TourneysLandingPageComponent {
  tabs = [
    { link: 'overview', label: 'Details' },
    { link: 'list', label: 'Turniere' },
    { link: 'leaderboard', label: 'Leaderboards' }
  ]

  activeLink = "overview";
}

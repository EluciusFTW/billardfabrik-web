import { Component } from '@angular/core';

@Component({
  selector: 'app-tourneys-landing-page',
  templateUrl: './tourneys-landing-page.component.html'
})
export class TourneysLandingPageComponent {
  tabs = [
    { link: 'overview', label: 'Details' },
    { link: 'leaderboard', label: 'Leaderboard' },
    { link: 'list', label: 'Turniere' },
    { link: 'achievements', label: 'Achievements' }
  ]

  activeLink = "overview";
}

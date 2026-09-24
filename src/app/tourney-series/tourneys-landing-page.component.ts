import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tourneys-landing-page',
  templateUrl: './tourneys-landing-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class TourneysLandingPageComponent {
  tabs = [
    { link: 'overview', label: 'Details' },
    { link: 'list', label: 'Turniere' },
    { link: 'leaderboard', label: 'Leaderboards' }
  ]

  activeLink = "overview";
}

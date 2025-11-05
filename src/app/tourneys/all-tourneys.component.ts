import { Component } from '@angular/core';

@Component({
  selector: 'app-all-tourneys',
  templateUrl: './all-tourneys.component.html',
  styleUrls: ['./all-tourneys.component.scss']
})
export class AllTourneysComponent {
  tabs = [
    { link: 'single', label: 'Einzelturniere' },
    { link: 'series', label: 'Turnier-Serien' },
  ]

  activeLink = 'single';
}

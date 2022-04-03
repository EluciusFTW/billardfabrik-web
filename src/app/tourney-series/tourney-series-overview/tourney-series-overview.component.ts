import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  templateUrl: './tourney-series-overview.component.html',
  styleUrls: ['./tourney-series-overview.component.scss']
})
export class TourneySeriesOverviewComponent {

  details: any[] = [
    {
      nrOf: '1-6',
      description: 'Eine Gruppe, jeder gegen jeden. \n Die beiden Gruppenersten spielen ein Finale um den Turniersieg',
      places: ['1.', '2.'],
      payout: ['66%', '33%'],
      points: ['5P', '3P']
    },
    {
      nrOf: '7-11',
      description: 'Zwei Gruppen. Die ersten beiden jeder Gruppe* spielen dann Halbfinale und Finale',
      places: ['1.', '2.', '3.', '4.'],
      payout: ['50%', '35%', '15%'],
      points: ['6P', '5P', '4P', '3P']
    },
    {
      nrOf: '12-23',
      description: 'Vier Gruppen, danach Viertel-, Halb- und Finale',
      places: ['1.', '2.', '3.', '4.', '5.-8.'],
      payout: ['40%', '30%', '20%', '10%'],
      points: ['8P', '6P', '5P', '4P', '3P']
    },
    {
      nrOf: '24-32',
      description: 'Acht Gruppen, danach Viertel-, Halb- und Finale',
      places: ['1.', '2.', '3.', '4.', '5.-8.', '9.-16.'],
      payout: ['40%', '30%', '20%', '10%'],
      points: ['10P', '8P', '6P', '5P', '4P', '3P']
    }
  ];

  displayDetails: string[] = ['nrOf', 'description', 'places', 'payout', 'points'];
  detailsDataSource = new MatTableDataSource<any>(this.details);
}

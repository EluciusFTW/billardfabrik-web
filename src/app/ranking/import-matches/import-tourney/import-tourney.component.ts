import { Component, OnInit } from '@angular/core';
import { EloService } from '../../elo.service';
import { TourneysService } from 'src/app/tourney-series/services/tourneys.service';
import { Tourney } from 'src/app/tourney-series/models/tourney';
import { take } from 'rxjs';

@Component({
  selector: 'app-import-tourney',
  templateUrl: './import-tourney.component.html',
  styleUrls: ['./import-tourney.component.scss']
})
export class ImportTourneyComponent implements OnInit {

  lastImported = ''
  unimportedTourneys: Tourney[] = [];
  
  constructor(
    private readonly eloService: EloService,
    private readonly tourneysService: TourneysService) {
  }

  async ngOnInit() {
    this.lastImported = await this.eloService.GetLastTourneyDate();
    this.tourneysService
      .getBetween(this.lastImported, '20990101')
      .pipe(take(1))
      .subscribe(tourneys => this.unimportedTourneys = tourneys);
  }
}

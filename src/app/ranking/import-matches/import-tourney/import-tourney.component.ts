import { Component, OnInit } from '@angular/core';
import { EloService } from '../../elo.service';
import { TourneysService } from 'src/app/tourney-series/services/tourneys.service';
import { Tourney } from 'src/app/tourney-series/models/tourney';
import { take } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { TourneyStatus, TourneyStatusMapper } from 'src/app/tourney-series/models/tourney-status';
import { EloImportService } from '../../elo-import.service';

@Component({
  selector: 'app-import-tourney',
  templateUrl: './import-tourney.component.html'
})
export class ImportTourneyComponent implements OnInit {

  lastImported = ''
  noTourneys = false;
  unimportedTourneys: MatTableDataSource<Tourney>;
  displayedColumns = ['name', 'date', 'status'];

  constructor(
    private readonly eloService: EloService,
    private readonly eloImportService: EloImportService,
    private readonly tourneysService: TourneysService) {
  }

  async ngOnInit() {
    await this.loadData();
  }

  private async loadData(): Promise<void> {
    this.lastImported = await this.eloService.GetLastTourneyDate();
    this.tourneysService
      .getAfter(this.lastImported)
      .pipe(take(1))
      .subscribe(tourneys => {
        if(tourneys.length > 0){
          this.noTourneys = false;
          this.unimportedTourneys = new MatTableDataSource<Tourney>(tourneys);
        }
      });
  }

  mapTourneyState(status: TourneyStatus) {
    return TourneyStatusMapper.map(status);
  }

  importable(tourney: Tourney): boolean {
    return tourney.meta.status === TourneyStatus.postProcessed;
  }

  async importBatch() {
    const imports = this.unimportedTourneys.data.map(tourney => this.importTourney(tourney));

    await Promise.all(imports);
    await this.loadData();
  }

  // async reset() {
  //   await this.eloService.reset();
  // }

  private async importTourney(tourney: Tourney): Promise<void> {
    let importedPlayers = await this.eloImportService.ImportPlayers(tourney);
    console.log('Imported Players: ', importedPlayers);

    let importedMatches = await this.eloImportService.ImportMatches(tourney);
    console.log('Imported Matches: ', importedMatches);
  }
}

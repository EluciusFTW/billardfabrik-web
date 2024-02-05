import { Component, OnInit, inject } from '@angular/core';
import { EloService } from '../../elo.service';
import { TourneysService } from 'src/app/tourney-series/services/tourneys.service';
import { Tourney } from 'src/app/tourney-series/models/tourney';
import { take } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { TourneyStatus, TourneyStatusMapper } from 'src/app/tourney-series/models/tourney-status';
import { EloTourneyImportService } from '../../elo-tourney-import.service';
import { OwnMessageService } from 'src/app/shared/services/own-message.service';

@Component({
  selector: 'app-import-tourney',
  templateUrl: './import-tourney.component.html'
})
export class ImportTourneyComponent implements OnInit {
  private readonly tourneyImportService = inject(EloTourneyImportService);
  private readonly tourneysService = inject(TourneysService);
  private readonly messager = inject(OwnMessageService);

  lastImported = ''
  noTourneys = true;
  unimportedTourneys: MatTableDataSource<Tourney>;
  displayedColumns = ['name', 'date', 'status'];

  async ngOnInit() {
    await this.loadData();
  }

  private async loadData(): Promise<void> {
    this.lastImported = await this.tourneyImportService.GetLastTourneyDate();
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

    await Promise
      .all(imports)
      .then(_ => this.messager.success(`${this.unimportedTourneys.data.length} Turniere erfolgreich importiert!`));

    await this.loadData();
  }

  private async importTourney(tourney: Tourney): Promise<void> {
    await this.tourneyImportService.ImportTourney(tourney);
  }
}

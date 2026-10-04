import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { TourneysService } from 'src/app/tourney-series/services/tourneys.service';
import { Tourney } from 'src/app/tourney-series/models/tourney';
import { firstValueFrom, map } from 'rxjs';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { TourneyStatus } from 'src/app/tourney-series/models/tourney-status';
import { EloTourneyImportService } from '../../elo-tourney-import.service';
import { OwnMessageService } from 'src/app/shared/services/own-message.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { DateKeyPipe } from '../../../tourney-series/date-key.pipe';

@Component({
  selector: 'app-import-ad-hoc-tourney',
  templateUrl: './import-ad-hoc-tourney.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatToolbar, MatButton, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, DateKeyPipe]
})
export class ImportAdHocTourneyComponent implements OnInit {
  private readonly tourneyImportService = inject(EloTourneyImportService);
  private readonly tourneysService = inject(TourneysService);
  private readonly messager = inject(OwnMessageService);

  noTourneys = true;
  unimportedTourneys: MatTableDataSource<Tourney>;
  displayedColumns = ['name', 'date'];

  async ngOnInit() {
    await this.loadData();
  }

  // Completed ad-hoc tourneys are marked as post-processed once their matches are imported.
  private async loadData(): Promise<void> {
    const tourneys = await firstValueFrom(
      this.tourneysService
        .getAdHoc()
        .pipe(map(tourneys => tourneys.filter(tourney => tourney.meta.status === TourneyStatus.completed))));

    this.noTourneys = tourneys.length === 0;
    this.unimportedTourneys = new MatTableDataSource<Tourney>(tourneys);
  }

  async importBatch() {
    const tourneys = this.unimportedTourneys.data;
    const imports = tourneys.map(tourney => this.importTourney(tourney));

    await Promise
      .all(imports)
      .then(_ => this.messager.success(`${tourneys.length} Ad-hoc-Turniere erfolgreich importiert!`));

    await this.loadData();
  }

  private async importTourney(tourney: Tourney): Promise<void> {
    await this.tourneyImportService.ImportTourney(tourney);
    this.tourneysService.update(tourney, { type: 'ResultsPostProcessed' });
  }
}

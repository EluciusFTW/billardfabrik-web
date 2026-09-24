import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { EloDemoInput, EloDemoTableComponent } from './elo-demo-table/elo-demo-table.component';
import { MatDialog } from '@angular/material/dialog';
import { EloSimulationComponent } from './elo-simulation/elo-simulation.component';
import { ContentTileComponent } from '../../shared/content-tile/content-tile.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-scoring-details',
  templateUrl: './scoring-details.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent, MatButton, EloDemoTableComponent]
})
export class ScoringDetailsComponent {
  private readonly dialog = inject(MatDialog);

  eloPairsSame: EloDemoInput[] = [
    { elo1: 1500, elo2: 1500 },
    { elo1: 1700, elo2: 1700 }
  ]

  eloPairsStrongerWinner: EloDemoInput[] = [
    { elo1: 1700, elo2: 1600 },
    { elo1: 1700, elo2: 1500 },
    { elo1: 1700, elo2: 1400 }
  ]

  eloPairsWeakerWinner: EloDemoInput[] = [
    { elo1: 1600, elo2: 1700 },
    { elo1: 1500, elo2: 1700 },
    { elo1: 1400, elo2: 1700 }
  ]

  eloModeComparison: EloDemoInput[] = [
    { elo1: 1700, elo2: 1500, mode: 'classic' },
    { elo1: 1700, elo2: 1500, mode: 'weighted' },
    { elo1: 1700, elo2: 1500, mode: 'weightedWithBonus' },
  ]

  simulate(): void {
    this.dialog
      .open(EloSimulationComponent, {})
  }
}

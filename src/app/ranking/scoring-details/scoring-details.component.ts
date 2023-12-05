import { Component } from '@angular/core';

@Component({
  selector: 'app-scoring-details',
  templateUrl: './scoring-details.component.html',
})
export class ScoringDetailsComponent {
  eloPairsSame: number[][] = [[1700, 1700], [1500, 1500]];
  eloPairsStrongerWinner: number[][] = [[1700, 1600], [1700,1500], [1700, 1400]];
  eloPairsWeakerWinner: number[][] = [[1600, 1700], [1500,1700], [1400, 1700]];
}

import { Component, input, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-score-display',
  template:`
      <span [ngClass]="{ 'neg': score() < 0, 'pos': score() > 0 }"> {{ score() }} </span>
      /
      <span [ngClass]="{ 'neg': -score() < 0, 'pos': -score() > 0 }"> {{ -score() }} </span>
    `,
  styles: [`
      .neg {
        color: red;
      }

      .pos {
        color: green;
      }
    `],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ScoreDisplayComponent {
  public score = input.required<number>();
}

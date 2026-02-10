import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-score-display',
  template: `
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
  imports: [NgClass]
})
export class ScoreDisplayComponent {
  public score = input.required<number>();
}

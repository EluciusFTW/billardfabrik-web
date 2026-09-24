import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent } from "@angular/material/dialog";
import { ChartConfiguration, ChartOptions } from "chart.js";
import { ComputedRankingPlayer } from "../models/ranking-player";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from "ng2-charts";

@Component({
  templateUrl: './player-progression-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogTitle, CdkScrollable, MatDialogContent, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())]
})
export class PlayerProgressionDialogComponent {
  dialogRef = inject<MatDialogRef<PlayerProgressionDialogComponent>>(MatDialogRef);
  player = inject<ComputedRankingPlayer>(MAT_DIALOG_DATA);

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: this.player.allScores.map((_, index) => index + 1),
    datasets: [
      {
        data: this.player.allScores,
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };

  close(): void {
    this.dialogRef.close();
  }
}

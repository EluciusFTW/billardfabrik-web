import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ChartConfiguration, ChartOptions } from "chart.js";
import { ComputedRankingPlayer } from "../models/ranking-player";

@Component({
  templateUrl: './player-progression-dialog.component.html',
})
export class PlayerProgressionDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PlayerProgressionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public player: ComputedRankingPlayer) {
  }

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

import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent } from "@angular/material/dialog";
import { ChartConfiguration, ChartOptions } from "chart.js";
import { RankingPlayer } from "../models/ranking-player";
import { EloRankingService } from "../elo-ranking.service";
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
  player = inject<RankingPlayer>(MAT_DIALOG_DATA);
  private readonly eloRankingService = inject(EloRankingService);

  public lineChartData: ChartConfiguration<'line'>['data'] | undefined;

  constructor() {
    this.loadHistory();
  }

  private async loadHistory(): Promise<void> {
    const scores = await this.eloRankingService.GetScoreHistory(this.player.name);
    this.lineChartData = {
      labels: scores.map((_, index) => index + 1),
      datasets: [
        {
          data: scores,
          fill: true,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: 'rgba(255,0,0,0.3)'
        }
      ]
    };
  }

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };

  close(): void {
    this.dialogRef.close();
  }
}

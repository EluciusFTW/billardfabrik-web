import { Component, Inject, ChangeDetectionStrategy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from "@angular/material/table";
import { TourneyEvaluation } from "../models/evaluation/tourney-evaluation";
import { TourneyPlacementType } from "../models/evaluation/tourney-placement-type";
import { TourneyPlayerEvaluation } from "../models/evaluation/tourney-player-evaluation";
import { TourneyMode } from "../models/tourney-mode";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatButton } from "@angular/material/button";

@Component({
  templateUrl: './show-results.dialog.component.html',
  styleUrls: ['./show-results.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatDialogActions, MatButton]
})
export class ShowResultsDialogComponent {
  playerResults: MatTableDataSource<any>;// = new MatTableDataSource<TourneyPlayerEvaluation>([]);
  displayedColumns = ['name', 'points', 'placement']
  mode: TourneyMode;

  constructor(
    public dialogRef: MatDialogRef<ShowResultsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public result: TourneyEvaluation) {

    this.playerResults = new MatTableDataSource<TourneyPlayerEvaluation>(result.players.sort((a,b) => a.placement.placement - b.placement.placement));
    this.mode = result.mode;
  }

  mapPlacement(placement: TourneyPlacementType) {
    return TourneyPlacementType.map(placement, this.mode);
  }

  close(): void {
    this.dialogRef.close();
  }
}

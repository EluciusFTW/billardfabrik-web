import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EloPlayer } from "../elo.service";

@Component({
  templateUrl: './player-progression-dialog.component.html',
})
export class PlayerProgressionDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PlayerProgressionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public player: EloPlayer) {
  }

  close(): void {
    this.dialogRef.close();
  }
}

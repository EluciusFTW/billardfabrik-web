import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './tourney-group-stage-add-player-dialog.component.html'
})
export class TourneyGroupStageAddPlayerDialogComponent {

  firstName: string;
  lastName: string;

  constructor(public dialogRef: MatDialogRef<TourneyGroupStageAddPlayerDialogComponent>) { }

  ngOnInit(): void {
  }

  submit(): void {
    this.dialogRef.close(this.firstName + ' ' + this.lastName);
  }

  abort(): void {
    this.dialogRef.close();
  }
}

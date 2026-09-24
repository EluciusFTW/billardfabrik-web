import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './tourney-group-stage-add-player-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class TourneyGroupStageAddPlayerDialogComponent {
  public dialogRef = inject(MatDialogRef<TourneyGroupStageAddPlayerDialogComponent>);

  firstName: string;
  lastName: string;

  submit(): void {
    this.dialogRef.close(this.firstName + ' ' + this.lastName);
  }

  abort(): void {
    this.dialogRef.close();
  }
}

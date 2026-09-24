import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  templateUrl: './tourney-group-stage-add-player-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogTitle, CdkScrollable, MatDialogContent, FormsModule, MatFormField, MatInput, MatDialogActions, MatButton]
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

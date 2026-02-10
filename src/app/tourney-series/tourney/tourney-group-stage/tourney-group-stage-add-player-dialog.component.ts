import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  templateUrl: './tourney-group-stage-add-player-dialog.component.html',
  imports: [MaterialModule, FormsModule]
})
export class TourneyGroupStageAddPlayerDialogComponent {
  public dialogRef = inject(MatDialogRef<TourneyGroupStageAddPlayerDialogComponent>);

  firstName: string;
  lastName: string;

  submit(): void {
    this.dialogRef.close(`${this.firstName} ${this.lastName}`);
  }

  abort(): void {
    this.dialogRef.close();
  }
}

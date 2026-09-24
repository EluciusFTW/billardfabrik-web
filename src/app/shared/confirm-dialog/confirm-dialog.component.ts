import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton]
})
export class ConfirmDialogComponent {

  data = inject<any>(MAT_DIALOG_DATA);
  dialogRef = inject<MatDialogRef<ConfirmDialogComponent>>(MatDialogRef);

  confirm(): void {
    this.dialogRef.close(true);
  }

  abort(): void {
    this.dialogRef.close(false);
  }
}

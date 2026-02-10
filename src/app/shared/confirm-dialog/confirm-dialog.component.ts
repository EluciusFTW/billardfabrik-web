import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { OwnMessageService } from '../services/own-message.service';
import { OwnConfirmService } from '../services/own-confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class ConfirmDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConfirmDialogComponent>) { }

  confirm(): void {
    this.dialogRef.close(true);
  }

  abort(): void {
    this.dialogRef.close(false);
  }
}

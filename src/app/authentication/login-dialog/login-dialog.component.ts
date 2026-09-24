import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogTitle, CdkScrollable, MatDialogContent, FormsModule, MatFormField, MatInput, MatDialogActions, MatButton]
})
export class LoginDialogComponent {
  dialogRef = inject<MatDialogRef<LoginDialogComponent>>(MatDialogRef);

  email: string;
  pwd: string;

  abort(): void {
    this.dialogRef.close();
  }

  login(): void {
    this.dialogRef.close({
      email: this.email,
      password: this.pwd
    });
  }
}

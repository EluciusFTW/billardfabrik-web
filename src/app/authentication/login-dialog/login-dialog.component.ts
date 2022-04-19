import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login-dialog.component.html'
})
export class LoginDialogComponent {

  email: string;
  pwd: string;

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>) { }

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

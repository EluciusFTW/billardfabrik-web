import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-login',
  templateUrl: './login-dialog.component.html',
  imports: [FormsModule, MaterialModule]
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

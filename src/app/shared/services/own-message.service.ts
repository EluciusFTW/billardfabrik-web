import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class OwnMessageService {

  constructor(private snackBar: MatSnackBar) { }

  success(title: string, body = ''): void {
    this.snackBar.open(title, 'Schließen');
  }

  failure(title: string, body = ''): void {
    this.snackBar.open(title, 'Schließen');
  }
}

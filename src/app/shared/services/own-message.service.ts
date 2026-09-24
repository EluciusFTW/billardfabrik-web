import { Service, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Service()
export class OwnMessageService {
  private snackBar = inject(MatSnackBar);

  success(title: string, body = ''): void {
    this.snackBar.open(title, 'Schließen');
  }

  failure(title: string, body = ''): void {
    this.snackBar.open(title, 'Schließen');
  }
}

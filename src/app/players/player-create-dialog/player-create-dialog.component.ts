import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Player } from '../player';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';

@Component({
  templateUrl: './player-create-dialog.component.html',
  styleUrls: ['player-create-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogTitle, CdkScrollable, MatDialogContent, FormsModule, MatFormField, MatInput, MatCheckbox, MatDialogActions, MatButton]
})
export class PlayerCreateDialogComponent {
  dialogRef = inject<MatDialogRef<PlayerCreateDialogComponent, Player>>(MatDialogRef);

  firstName: string;
  lastName: string;
  club: boolean = false;
  error: string = '';

  submit(): void {
    const invalidCharsInFirstName = this.invalidChars(this.firstName)
    if(invalidCharsInFirstName){
      this.error = "Unerlaubte(s) Zeichen im Vornamen: " + invalidCharsInFirstName;
      return;
    }

    const invalidCharsInLastName = this.invalidChars(this.lastName)
    if(invalidCharsInLastName){
      this.error = "Unerlaubte(s) Zeichen im Nachnamen: " + invalidCharsInLastName;
      return;
    }

    this.dialogRef.close({
      firstName: this.firstName,
      lastName: this.lastName,
      clubPlayer: this.club,
      enteredInSystem: new Date().valueOf(),
      showForElo: true,
      showForTourneys: true,
      showForLeaderboard: true
    });
  }

  private invalidChars(name: string) : string {
    const letters = /^[a-zA-Z0-9öäüß-]+$/;
    return [...name]
      .filter(c => !c.match(letters))
      .join('')
  }

  abort(): void {
    this.dialogRef.close();
  }
}

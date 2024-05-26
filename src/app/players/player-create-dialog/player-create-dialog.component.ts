import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Player } from '../player';

@Component({
  templateUrl: './player-create-dialog.component.html',
  styleUrls: ['player-create-dialog.component.scss']
})
export class PlayerCreateDialogComponent {

  firstName: string;
  lastName: string;
  club: boolean = false;
  error: string = '';

  constructor(public dialogRef: MatDialogRef<PlayerCreateDialogComponent, Player>) { }

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

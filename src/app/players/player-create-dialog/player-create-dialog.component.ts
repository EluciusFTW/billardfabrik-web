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

  constructor(public dialogRef: MatDialogRef<PlayerCreateDialogComponent>) { }

  submit(): void {
    const firstNameError = this.validate(this.firstName)
    if(firstNameError){
      this.error = "Unerlaubtes Zeichen im Vornamen: " + firstNameError;
      return;
    }

    const lastNameError = this.validate(this.lastName)
    if(lastNameError){
      this.error = "Unerlaubtes Zeichen im Nachnamen: " + lastNameError;
      return;
    }

    const player: Player = {
      firstName: this.firstName,
      lastName: this.lastName,
      clubPlayer: this.club,
      enteredInSystem: new Date().valueOf(),
      showForElo: true,
      showForTourneys: true,
      showForLeaderboard: true
    }

    this.dialogRef.close(player);
  }

  private validate(name: string) : string {
    const letters = /^[a-zA-Z0-9]+$/;

    for (let i = 0; i < name.length; i++) {
      if (!name[i].match(letters) ) {
        this.error = 'Invalid character: ' + name[i];
        return name[i];
      }
    }

    return '';
  }

  abort(): void {
    this.dialogRef.close();
  }
}

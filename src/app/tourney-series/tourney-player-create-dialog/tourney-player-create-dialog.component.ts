import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TourneyPlayer } from '../models/evaluation/tourney-player';

@Component({
  selector: 'app-tourney-player-create-dialog',
  templateUrl: './tourney-player-create-dialog.component.html',
  styleUrls: ['tourney-player-create-dialog.component.scss']
})
export class TourneyPlayerCreateDialogComponent {

  firstName: string;
  lastName: string;
  club: boolean = false;
  error: string = '';

  constructor(
    public dialogRef: MatDialogRef<TourneyPlayerCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public player: TourneyPlayer) { }

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

    this.player.firstName = this.firstName;
    this.player.lastName = this.lastName;
    this.player.clubPlayer = this.club;
    this.player.enteredInSystem = new Date().valueOf();

    this.dialogRef.close(this.player);
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

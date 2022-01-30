import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TourneyPlayer } from '../models/tourney-player';

@Component({
  selector: 'app-tourney-player-create-dialog',
  templateUrl: './tourney-player-create-dialog.component.html'
})
export class TourneyPlayerCreateDialogComponent implements OnInit {

  dialogTitle: string = 'Neuen Spieler erstellen';
  firstName: string;
  lastName: string;
  clubName: string;
  club: boolean = false;
  ourClub: boolean = false;
  error: string = "";

  constructor(
    public dialogRef: MatDialogRef<TourneyPlayerCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public player: TourneyPlayer) { }

  ngOnInit(): void {
  }

  submit(): void {

    const firstNameError = this.validate(this.firstName)
    if(firstNameError){
      this.error = "First name contains illegal character: " + firstNameError;
      return;
    }

    const lastNameError = this.validate(this.lastName)
    if(lastNameError){
      this.error = "Last name contains illegal character: " + lastNameError;
      return;
    }

    this.player.firstName = this.firstName;
    this.player.lastName = this.lastName;
    this.player.clubPlayer = this.club;
    this.player.club = this.getClubName()
    this.player.enteredInSystem = new Date().valueOf();

    this.dialogRef.close(this.player);
  }

  private validate(name: string) : string {
    const letters = /^[a-zA-Z0-9]+$/;

    for (var i = 0; i < name.length; i++) {
      if (!name[i].match(letters) ) {
        this.error = "Invalid character: " + name[i];
        return name[i];
      }
    }

    return "";
  }

  private getClubName(): string{
    return this.club
      ? this.ourClub
        ? 'BILLARDFABRIK'
        : this.clubName || ''
      : '';
  }

  abort(): void {
    this.dialogRef.close();
  }
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  templateUrl: './order-players-dialog.component.html',
  // styleUrls: ['player-create-dialog.component.scss']
})
export class OrderPlayersDialogComponent {
  players: string[];

  constructor(
    public dialogRef: MatDialogRef<OrderPlayersDialogComponent, string[]>,
    @Inject(MAT_DIALOG_DATA) public data: { players: string[] }
  ) {
    this.players = data.players;
  }

  drop(event: any) {
    moveItemInArray(this.players, event.previousIndex, event.currentIndex);
  }

  submit(): void {
    this.dialogRef.close(this.players);
  }

  abort(): void {
    this.dialogRef.close();
  }
}

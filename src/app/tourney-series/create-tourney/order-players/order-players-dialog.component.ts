import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
  templateUrl: './order-players-dialog.component.html',
  // styleUrls: ['player-create-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogTitle, CdkScrollable, MatDialogContent, CdkDropList, CdkDrag, MatDialogActions, MatButton]
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

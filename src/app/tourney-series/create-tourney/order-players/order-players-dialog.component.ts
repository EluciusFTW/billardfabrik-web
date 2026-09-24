import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
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
  dialogRef = inject<MatDialogRef<OrderPlayersDialogComponent, string[]>>(MatDialogRef);
  data = inject<{
    players: string[];
}>(MAT_DIALOG_DATA);

  players: string[];

  constructor() {
    const data = this.data;

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

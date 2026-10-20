import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import {CdkDragDrop, CdkDropList, CdkDrag, CdkDragHandle, moveItemInArray} from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SeedingScope } from './seeding-scope';
import { seedTier } from '../seeding.functions';

const maxShadedTier = 4;

@Component({
  templateUrl: './order-players-dialog.component.html',
  styleUrls: ['./order-players-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogTitle, CdkScrollable, MatDialogContent, CdkDropList, CdkDrag, CdkDragHandle, MatDialogActions, MatButton, MatIcon]
})
export class OrderPlayersDialogComponent {
  dialogRef = inject<MatDialogRef<OrderPlayersDialogComponent, string[]>>(MatDialogRef);
  data = inject<{
    players: string[];
    scope: SeedingScope;
}>(MAT_DIALOG_DATA);

  players: string[];
  readonly scope: SeedingScope;
  // With a single seed (one group, or two players in a bracket) the order has no effect
  readonly numberOfSeeds: number;

  constructor() {
    const data = this.data;

    this.players = data.players;
    this.scope = data.scope;
    this.numberOfSeeds = Math.min(SeedingScope.numberOfSeeds(data.scope), data.players.length);
  }

  get orderMatters(): boolean {
    return this.numberOfSeeds > 1;
  }

  isSeed(index: number): boolean {
    return this.orderMatters && index < this.numberOfSeeds;
  }

  rowClasses(index: number): string[] {
    if (!this.isSeed(index)) {
      return [];
    }

    const tier = this.scope.kind === 'Bracket'
      ? Math.min(seedTier(index + 1), maxShadedTier)
      : 0;

    return [
      'seed',
      `seed-tier-${tier}`,
      ...(index === this.numberOfSeeds - 1 ? ['last-seed'] : [])
    ];
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.players, event.previousIndex, event.currentIndex);
  }

  submit(): void {
    this.dialogRef.close(this.players);
  }

  abort(): void {
    this.dialogRef.close();
  }
}

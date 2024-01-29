import { SnapshotAction } from '@angular/fire/compat/database';

export type Db<T> = T & { key: string }

export function unpackSnapshotsWithKey<T>(snapshots: SnapshotAction<T>[]): Db<T>[] {
    return snapshots.map(c => ({ key: c.key!, ...c.payload.val()!}));
}

export function unpackSnapshots<T>(snapshots: SnapshotAction<T>[]): T[] {
    return snapshots.map(c => c.payload.val()!);
}

export function withoutKey<T>(item: Db<T>): T {
  const { key, ...rest } = item;
  return rest as T;
}

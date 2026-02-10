import { DatabaseReference, DataSnapshot, listVal, Query } from '@angular/fire/database';
import { Observable } from 'rxjs';

export type Db<T> = T & { key: string };

export function unpackSnapshotWithKeyModular<T>(change: { snapshot: DataSnapshot }): Db<T> {
  return { key: change.snapshot.key!, ...(change.snapshot.val() as T) };
}

export function unpackSnapshotsWithKeyModular<T>(changes: { snapshot: DataSnapshot }[]): Db<T>[] {
  return changes.map(c => unpackSnapshotWithKeyModular<T>(c));
}

export function listValWithKey<T>(query: Query) {
  return listVal<Db<T>>(query, { keyField: 'key' });
}

export function compareByKey<T>(a: Db<T>, b: Db<T>) {
  if (a.key < b.key) {
    return -1;
  }
  if (a.key > b.key) {
    return 1;
  }
  return 0;
}

export function withoutKey<T>(item: Db<T>): T {
  const { key, ...rest } = item;
  return rest as T;
}

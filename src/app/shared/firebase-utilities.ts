import { DataSnapshot, listVal, Query } from '@angular/fire/database';

export type Db<T> = T & { key: string };

export function unpackSnapshotWithKey<T>(change: { snapshot: DataSnapshot }): Db<T> {
  return { key: change.snapshot.key!, ...(change.snapshot.val() as T) };
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

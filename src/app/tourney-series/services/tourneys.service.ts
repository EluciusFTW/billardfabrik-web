import { Injectable, inject } from '@angular/core';
import { ref, query, object, list, listVal, limitToLast, orderByKey, startAt, endAt, update, set } from '@angular/fire/database';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OwnMessageService } from 'src/app/shared/services/own-message.service';
import { Tourney } from '../models/tourney';
import { TourneyPhaseEvent } from '../models/tourney-phase-event';
import { TourneyEventService } from '../event-handling/tourney-event.service';
import { Db, listValWithKey, unpackSnapshotWithKeyModular } from 'src/app/shared/firebase-utilities';
import { TourneyFunctions } from '../tourney/tourney-functions';
import { FirebaseService } from 'src/app/shared/firebase.service';

const DB_TOURNEYS_LPATH = 'tourneySeries/tourneys';

@Injectable()
export class TourneysService extends FirebaseService {
  private readonly eventService = inject(TourneyEventService);
  private readonly messageService = inject(OwnMessageService);
  private readonly tourneysRef = ref(this.db, DB_TOURNEYS_LPATH);

  get(id: string): Observable<Db<Tourney>> {
    return object(ref(this.db, `${DB_TOURNEYS_LPATH}/${id}`))
      .pipe(map(snapshot => unpackSnapshotWithKeyModular<Tourney>(snapshot)));
  }

  getAll(): Observable<Db<Tourney>[]> {
    return listValWithKey<Tourney>(this.tourneysRef);
  }

  async getLastOccurrence(): Promise<number> {
    const q = query(this.tourneysRef, limitToLast(1));
    const lastTourney = (await firstValueFrom(listVal<Tourney>(q)))[0];

    return lastTourney?.meta.occurrence ?? 0;
  }

  getFromYear(year: number): Observable<Db<Tourney>[]> {
    const q = query(this.tourneysRef, orderByKey(), startAt(`${year}0000`), endAt(`${year}9999`));
    return listValWithKey<Tourney>(q);
  }

  getBetween(start: string, end: string): Observable<Db<Tourney>[]> {
    const q = query(this.tourneysRef, orderByKey(), startAt(start), endAt(end));
    return listValWithKey<Tourney>(q);
  }

  getAfter(start: string): Observable<Db<Tourney>[]> {
    const actualStart = start || '0';
    return this.getBetween(`${+actualStart + 1}`, 'X');
  }

  update(tourney: Tourney, event: TourneyPhaseEvent): void {
    this.eventService.apply(tourney, event);
    const key = this.tryGetKey(tourney);
    if (!!key) {
      update(ref(this.db, `${DB_TOURNEYS_LPATH}/${key}`), tourney)
    } else {
      this.save(tourney);
    }
  }

  async save(tourney: Tourney): Promise<void> {
    const last = await this.getLastOccurrence();
    tourney.meta.occurrence = last + 1;

    return set(ref(this.db, this.tourneyPath(tourney)), tourney)
      .then(
        () => this.messageService.success('Neues Turnier erfolgreich gespeichert.'),
        () => this.messageService.failure('Fehler beim Speichern des neuen Turniers.'));
  }

  private tourneyPath(tourney: Tourney): string {
    return `${DB_TOURNEYS_LPATH}/${TourneyFunctions.Key(tourney)}`;
  }

  private tryGetKey(tourney: Tourney): string | undefined {
    return (<any>tourney).key;
  }
}

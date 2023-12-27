import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { OwnMessageService } from 'src/app/shared/services/own-message.service';
import { Tourney } from '../models/tourney';
import { TourneyPhaseEvent } from '../models/tourney-phase-event';
import { TourneyEventService } from './event-handling/tourney-event.service';

const DB_TOURNEYS_LPATH = 'tourneySeries/tourneys';

@Injectable()
export class TourneysService {

  constructor(
    private db: AngularFireDatabase,
    private eventService: TourneyEventService,
    private messageService: OwnMessageService
  ) { }

  get(id: string): Observable<Tourney> {
    return this.db
      .object<Tourney>(DB_TOURNEYS_LPATH + '/' + id)
      .snapshotChanges()
      .pipe(map(changes => ({ key: changes.payload.key, ...changes.payload.val() })));
  }

  getAll(): Observable<Tourney[]> {
    return this.db
      .list<Tourney>(DB_TOURNEYS_LPATH)
      .snapshotChanges()
      .pipe(map(changes => <Tourney[]>changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  addNumber(): void {
    const tourneys = this.db
      .list<Tourney>(DB_TOURNEYS_LPATH)
      .snapshotChanges()
      .pipe(map(changes => <Tourney[]>changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));

    tourneys
      .pipe(take(1))
      .subscribe(ts => ts.forEach((tourney, index) => {
        tourney.meta.occurrence = index + 1;
        this.db
          .list(DB_TOURNEYS_LPATH)
          .update(this.getKey(tourney), tourney);
      }));
  }

  getLastOccurrence(): Observable<number> {
    return this.db
      .list<Tourney>(DB_TOURNEYS_LPATH, ref => ref.limitToLast(1))
      .valueChanges()
      .pipe(
        take(1),
        map(ts => ts[0]?.meta.occurrence ?? 0));
  }

  getFromYear(year: number): Observable<Tourney[]> {
    return this.db
      .list<Tourney>(DB_TOURNEYS_LPATH, ref => ref.orderByKey().startAt(`${year}0000`).endAt(`${year}9999`))
      .snapshotChanges()
      .pipe(map(changes => <Tourney[]>changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  getBetween(start: string, end: string): Observable<Tourney[]> {
    return this.db
      .list<Tourney>(DB_TOURNEYS_LPATH, ref => ref.orderByKey().startAt(start).endAt(end))
      .snapshotChanges()
      .pipe(map(changes => <Tourney[]>changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  getAfter(start: string): Observable<Tourney[]> {
    const actualStart = start || "0";
    return this.getBetween(`${+actualStart + 1}`, 'X');
  }

  update(tourney: Tourney, event: TourneyPhaseEvent): void {
    this.eventService.apply(tourney, event);
    const key = this.getKey(tourney);
    if (!!key) {
      this.db
        .list(DB_TOURNEYS_LPATH)
        .update(key, tourney);
    } else {
      this.save(tourney);
    }
  }

  save(tourney: Tourney): void {
    this
      .getLastOccurrence()
      .subscribe(last => {
        tourney.meta.occurrence = last + 1;
        this.db
          .object(DB_TOURNEYS_LPATH + '/' + tourney.meta.date)
          .set(tourney)
          .then(
            () => this.messageService.success('Neues Turnier erfolgreich gespeichert.'),
            () => this.messageService.failure('Fehler beim Speichern des neuen Turniers.'));
      })
  }

  private getKey(tourney: Tourney): string {
    return (<any>tourney).key;
  }
}

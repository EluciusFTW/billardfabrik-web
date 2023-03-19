import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    return this.db.object<Tourney>(DB_TOURNEYS_LPATH + '/' + id)
      .snapshotChanges()
      .pipe(map(changes => ({ key: changes.payload.key, ...changes.payload.val() })));
  }

  getAll(): Observable<Tourney[]> {
    return this.db
      .list<Tourney>(DB_TOURNEYS_LPATH)
      .snapshotChanges()
      .pipe(map(changes => <Tourney[]>changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  getFromYear(year: number): Observable<Tourney[]> {
    return this.db
      .list<Tourney>(DB_TOURNEYS_LPATH, ref => ref.orderByKey().startAt(`${year}0000`).endAt(`${year}9999`))
      .snapshotChanges()
      .pipe(map(changes => <Tourney[]>changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  update(tourney: Tourney, event: TourneyPhaseEvent): void {
    this.eventService.apply(tourney, event);
    const key = this.getKey(tourney);
    if (!!key) {
      this.db.list(DB_TOURNEYS_LPATH).update(key, tourney);
    } else {
      this.save(tourney);
    }
  }

  save(tourney: Tourney): void {
    this.db.object(DB_TOURNEYS_LPATH + '/' + this.getDateString())
      .set(tourney)
      .then(() => this.messageService.success('Neues Turnier erfolgreich erstellt'));
  }

  private getDateString(): string {
    const date = new Date();
    const yy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    return [yy,
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd
    ].join('');
  }

  private getKey(tourney: Tourney): string {
    return (<any>tourney).key;
  }
}

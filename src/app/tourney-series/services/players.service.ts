import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayerResultsRecord, TourneyPlayer } from '../models/tourney-player';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { OwnMessageService } from 'src/app/shared/services/own-message.service';
import { first, map } from 'rxjs/operators';
import { PlayerMatchRecord, TourneyPlacementType, TourneyPlayerEvaluation } from '../models/tourney-evaluation';
import { LeaderBoardPlayer } from '../models/leaderboard-player';

const DB_PLAYERS_LPATH = 'tourneySeries/players';
const DB_PLAYERRESULTS_LPATH = 'tourneySeries/playerResults';

@Injectable()
export class PlayersService {

  constructor(private db: AngularFireDatabase, private messageService: OwnMessageService) { }

  getAll(): Observable<TourneyPlayer[]> {
    return this.db
      .list<TourneyPlayer>(DB_PLAYERS_LPATH)
      .snapshotChanges()
      .pipe(
        map(changes => <TourneyPlayer[]>changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
      );
  }

  getAllResults(): Observable<LeaderBoardPlayer[]> {
    return this.db
      .list<PlayerResultsRecord>(DB_PLAYERRESULTS_LPATH)
      .snapshotChanges()
      .pipe(
        map(changes => <LeaderBoardPlayer[]>changes.map(c => this.toLeaderBoardPlayer(c.payload.key, c.payload.val())))
      );
  }

  private toLeaderBoardPlayer(nameKey: string, player: PlayerResultsRecord): LeaderBoardPlayer {
    const placements = Object.values(player.placements);
    const matches = Object.values(player.matches);
    const achievements = Object.values(player.achievements || []);
    return {
      name: this.nameFromKey(nameKey),
      points: placements.reduce((acc, curr) => acc + curr.points, 0),
      participations: placements.length,
      winPercentage: matches.filter(m => m.myScore > m.oppScore).length / matches.length,
      scored: matches.reduce((score, match) => score + match.myScore, 0),
      received: matches.reduce((score, match) => score + match.oppScore, 0),
      matches: matches.length,
      placements: {
        gold: placements.filter(record => record.placement === TourneyPlacementType.Winner).length,
        silver: placements.filter(record => record.placement === TourneyPlacementType.RunnerUp).length,
        bronze: placements.filter(record => record.placement === TourneyPlacementType.ThirdPlace).length
      },
      achievements: achievements || []
    }
  }

  updatePlayer(item: TourneyPlayer): void {
    const key = this.getKey(item);
    if (!!key) {
      this.db
        .list(DB_PLAYERS_LPATH)
        .update(key, item);
    } else {
      this.saveItem(item);
    }
  }

  saveItem(player: TourneyPlayer): void {
    this.messageService.success('Save called ');

    this.db
      .object(DB_PLAYERS_LPATH + '/' + this.keyFromPlayer(player))
      .set(player);
  }

  AddPlayerRecord(evaluation: TourneyPlayerEvaluation): void {
    evaluation.matches.forEach(match => this.AddMatchTo(evaluation.name, match));
    this.db
      .object(this.playerResultsKey(evaluation.name) + '/placements/' + evaluation.placement.tourney)
      .set(evaluation.placement);
  }

  AddMatchTo(name: string, match: PlayerMatchRecord): void {
    const matchesPath = this.playerResultsKey(name) + '/matches';
    this.db
      .list<PlayerMatchRecord>(matchesPath, ref => ref.orderByChild('tourney').equalTo(match.tourney))
      .snapshotChanges()
      .pipe(
        first(),
        map(changes => <PlayerMatchRecord[]>changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))),
      )
      .subscribe(
        matches => {
          if (!matches.find(m => m.opponent === match.opponent && m.type === match.type)) {
            this.db
              .list<PlayerMatchRecord>(matchesPath)
              .push(match);
          }
        }
      );
  }

  private playerResultsKey(name: string): string {
    return DB_PLAYERRESULTS_LPATH + '/' + this.keyFromName(name);
  }

  private getKey(n: TourneyPlayer): string {
    return (<any>n).key;
  }

  private keyFromPlayer(player: TourneyPlayer): string {
    return player.firstName + '_' + player.lastName;
  }

  private keyFromName(name: string): string {
    return name.replace(' ', '_');
  }

  private nameFromKey(name: string): string {
    return name.replace('_', ' ');
  }
}

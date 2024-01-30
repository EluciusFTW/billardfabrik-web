import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TourneyPlayer } from '../models/evaluation/tourney-player';
import { OwnMessageService } from 'src/app/shared/services/own-message.service';
import { first, map } from 'rxjs/operators';
import { TourneyPlayerEvaluation } from '../models/evaluation/tourney-player-evaluation';
import { PlayerMatchRecord } from '../models/evaluation/player-match-record';
import { TourneyPlacementType } from '../models/evaluation/tourney-placement-type';
import { LeaderBoardPlayer } from '../models/leaderboard-player';
import { PlayerResultsRecord } from '../models/evaluation/player-results-record';
import { TourneyFunctions } from '../tourney/tourney-functions';
import { FirebaseService } from 'src/app/shared/firebase.service';

const DB_PLAYERS_LPATH = 'tourneySeries/players';
const DB_PLAYERRESULTS_LPATH = 'tourneySeries/playerResults';

@Injectable()
export class PlayersService extends FirebaseService {
  private readonly messageService = inject(OwnMessageService);

  getAllLeaderboardPlayers(start: string, end: string): Observable<LeaderBoardPlayer[]> {
    return this.db
      .list<PlayerResultsRecord>(DB_PLAYERRESULTS_LPATH)
      .snapshotChanges()
      .pipe(
        map(snapshots => snapshots
          .map(snapshot => this.toLeaderBoardPlayer(snapshot.payload.key, snapshot.payload.val(), start, end))
          .filter(player => player.participations > 0))
      );
  }

  private toLeaderBoardPlayer(nameKey: string, player: PlayerResultsRecord, start: string, end: string): LeaderBoardPlayer {
    const earliestTick = TourneyFunctions.NameFragmentToDate(start).valueOf();
    const latestTick = TourneyFunctions.NameFragmentToDate(end).valueOf();

    const placements = Object.values(player.placements)
      .filter(p => p.tourney.slice(-8) >= start)
      .filter(p => p.tourney.slice(-8) <= end);

    const matches = Object
      .values(player.matches)
      .filter(match => match.when >= earliestTick)
      .filter(match => match.when <= latestTick);

    return {
      name: this.nameFromKey(nameKey),
      points: placements.reduce((acc, curr) => acc + curr.points, 0),
      participations: placements.length,
      winPercentage: matches.filter(m => m.myScore > m.oppScore).length / matches.length,
      scored: matches.reduce((score, match) => score + match.myScore, 0),
      received: matches.reduce((score, match) => score + match.oppScore, 0),
      matches: matches.length,
      placements: {
        gold: placements.filter(record => record.placement === TourneyPlacementType.First).length,
        silver: placements.filter(record => record.placement === TourneyPlacementType.Second).length,
        bronze: placements.filter(record => record.placement === TourneyPlacementType.Third).length
      },
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

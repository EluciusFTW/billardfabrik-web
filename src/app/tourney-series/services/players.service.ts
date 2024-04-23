import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { TourneyPlayerEvaluation } from '../models/evaluation/tourney-player-evaluation';
import { PlayerMatchRecord } from '../models/evaluation/player-match-record';
import { TourneyPlacementType } from '../models/evaluation/tourney-placement-type';
import { LeaderBoardPlayer } from '../models/leaderboard-player';
import { PlayerResultsRecord } from '../models/evaluation/player-results-record';
import { TourneyFunctions } from '../tourney/tourney-functions';
import { FirebaseService } from 'src/app/shared/firebase.service';
import { PlayerFunctions } from 'src/app/players/player-functions';
import { PlayersService as PS } from 'src/app/players/players.service';

const DB_PLAYERRESULTS_LPATH = 'tourneySeries/playerResults';

@Injectable()
export class PlayersService extends FirebaseService {
  private readonly playersService = inject(PS);

  async getAllLeaderboardPlayers(start: string, end: string): Promise<LeaderBoardPlayer[]> {
    const leaderBoardParticipants = await firstValueFrom(
      this.playersService
        .getLeaderBoardPlayers()
        .pipe(map(players => players.map(player => PlayerFunctions.keyFromPlayer(player))))
      );

    return firstValueFrom(this.db
      .list<PlayerResultsRecord>(DB_PLAYERRESULTS_LPATH)
      .snapshotChanges()
      .pipe(
        map(snapshots => snapshots
          .filter(snapshot => leaderBoardParticipants.includes(snapshot.payload.key))
          .map(snapshot => this.toLeaderBoardPlayer(snapshot.payload.key, snapshot.payload.val(), start, end))
          .filter(player => player.participations > 0))
      ));
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
      name: PlayerFunctions.nameFromKey(nameKey),
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

  async AddPlayerRecord(evaluation: TourneyPlayerEvaluation): Promise<void> {
    await this.AddMatchesTo(evaluation);
    await this.db
      .object(this.playerResultsKey(evaluation.name) + '/placements/' + evaluation.placement.tourney)
      .set(evaluation.placement);
  }

  private async AddMatchesTo(evaluation: TourneyPlayerEvaluation): Promise<void> {
    const matchesPath = this.playerResultsKey(evaluation.name) + '/matches';
    const tourney = evaluation.matches[0].tourney;
    const existingMatches = await firstValueFrom(
      this.db
        .list<PlayerMatchRecord>(matchesPath, ref => ref.orderByChild('tourney').equalTo(tourney))
        .valueChanges());

    await Promise.all(
      evaluation.matches
        .filter(match => !existingMatches.find(m => m.opponent === match.opponent && m.type === match.type))
        .map(match => this.db
          .list<PlayerMatchRecord>(matchesPath)
          .push(match)));
  }

  private playerResultsKey(name: string): string {
    return DB_PLAYERRESULTS_LPATH + '/' + PlayerFunctions.keyFromName(name);
  }
}

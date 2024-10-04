import { Injectable, inject } from '@angular/core';
import { EloFunctions } from './elo-functions';
import { IncomingMatch, ScoredMatch } from './models/ranking-match';
import { EloPlayer } from './models/elo-models';
import { Db } from '../shared/firebase-utilities';
import { PlayerFunctions } from '../players/player-functions';
import { FirebaseService } from '../shared/firebase.service';
import { EloRankingService } from './elo-ranking.service';

export const DB_MATCHES_LPATH = 'elo/rankedmatches';
export const DB_INCOMING_TOURNEY_MATCHES_LPATH = 'elo/incomingmatches/from-tourneys';
export const DB_INCOMING_CHALLENGE_MATCHES_LPATH = 'elo/incomingmatches/from-challenges';
export const DB_PLAYERS_PATH = 'elo/players';

@Injectable()
export class EloService extends FirebaseService {
  private readonly rankingService = inject(EloRankingService);

  async UpdateEloScores(): Promise<void> {
    let eloPlayers = await this.rankingService.GetEloListedPlayers();
    let unrankedMatches = await this.rankingService.GetUnrankedMatches();

    let matchData = unrankedMatches
      .map(match => ({
        match: { ... match, scores: {} } as Db<ScoredMatch>,
        p1: eloPlayers.find(player => player.name === match.playerOne.name)
          ?? this.createNewPlayer(match.playerOne.name, eloPlayers),
        p2: eloPlayers.find(player => player.name === match.playerTwo.name)
          ?? this.createNewPlayer(match.playerTwo.name, eloPlayers),
      }))
      .filter(data => !data.p1.changes.find(c => c.match === data.match.key))
      .filter(data => !data.p2.changes.find(c => c.match === data.match.key))

    matchData
      .forEach(data => {
        const eloInput = {
          discipline: data.match.discipline,
          p1Points: data.match.playerOne.points,
          p2Points: data.match.playerTwo.points,
          p1DataPoint: data.p1.changes[data.p1.changes.length - 1],
          p2DataPoint: data.p2.changes[data.p2.changes.length - 1]
        }

        const scores = EloFunctions.calculateAll(eloInput);
        data.p1.changes.push({
          match: data.match.key,
          ... EloFunctions.Add(eloInput.p1DataPoint, scores, 'P1')
        })
        data.p2.changes.push({
          match: data.match.key,
          ... EloFunctions.Add(eloInput.p2DataPoint, scores, 'P2')
        })
        data.match.scores = scores;
      });

    const evaluatedMatches = matchData.map(data => data.match);
    await this.SaveRankedMatches(evaluatedMatches);
    await this.UpdatePlayers(eloPlayers);
    await this.RemoveIncomingMatches(evaluatedMatches);
    await this.rankingService.UpdateRanking();
  }

  private createNewPlayer(name: string, existing: EloPlayer[]) {
    const newPlayer = {
      name: name,
      changes: [{
        match: '__InitialSeed__',
        cla: EloFunctions.InitialValue,
        bvf: EloFunctions.InitialValue,
        wwb: EloFunctions.InitialValue,
        wnb: EloFunctions.InitialValue,
      }],
    };

    existing.push(newPlayer);
    return newPlayer;
  }

  private async RemoveIncomingMatches(matches: Db<IncomingMatch>[]): Promise<void[]> {
    let removals = matches
      .filter(match => match.source === 'Tourney')
      .map(match => this.db
        .list(DB_INCOMING_TOURNEY_MATCHES_LPATH)
        .remove(match.key));

    let challenges = matches
      .filter(match => match.source === 'Challenge')
      .map(match => this.db
        .list(DB_INCOMING_CHALLENGE_MATCHES_LPATH)
        .remove(match.key));

    return Promise.all(removals.concat(challenges));
  }

  UpdatePlayers(players: EloPlayer[]): Promise<void[]> {
    let updates = players
      .map(player => ({ key: PlayerFunctions.keyFromName(player.name), c: { changes: player.changes } }))
      .map(ranking => this.db
        .object(`${DB_PLAYERS_PATH}/${ranking.key}`)
        .update(ranking.c))

    return Promise.all(updates);
  }

  SaveRankedMatches(matches: Db<ScoredMatch>[]): Promise<void[]> {
    let updates = matches
      .map(match => this.db
        .object(`${DB_MATCHES_LPATH}/${match.key}`)
        .update(match))

    return Promise.all(updates);
  }
}

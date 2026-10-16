// Head-to-head statistics of two players, computed from their ranked matches.
// Everything is seen from the perspective of the first player: wins are their wins, points are
// the racks (or balls in 14/1) they scored against the other, elo is the net elo (bvf) they gained.
import { PoolDiscipline, POOL_DISCIPLINES } from '../tourney-series/models/pool-discipline';
import { ScoredMatch } from './models/ranking-match';

export type HeadToHeadRecord = {
  matches: number;
  wins: number;
  losses: number;
  draws: number;
  pointsFor: number;
  pointsAgainst: number;
  elo: number;
};

export type HeadToHeadEncounter = {
  date: string;
  discipline: PoolDiscipline;
  source: ScoredMatch['source'];
  pointsFor: number;
  pointsAgainst: number;
  elo: number;
};

export type DisciplineRecord = HeadToHeadRecord & { discipline: PoolDiscipline };

export type HeadToHead = {
  player: string;
  opponent: string;
  total: HeadToHeadRecord;
  byDiscipline: DisciplineRecord[];
  // most recent first
  encounters: HeadToHeadEncounter[];
};

export namespace HeadToHead {
  const emptyRecord: HeadToHeadRecord = { matches: 0, wins: 0, losses: 0, draws: 0, pointsFor: 0, pointsAgainst: 0, elo: 0 };

  // The matches are expected in the order they were ranked, so that matches of the same day stay in order.
  export function of(player: string, opponent: string, matches: ScoredMatch[]): HeadToHead {
    const encounters = [...matches]
      .reverse()
      .map(match => asEncounter(player, opponent, match))
      .filter((encounter): encounter is HeadToHeadEncounter => encounter !== null)
      .sort((a, b) => b.date.localeCompare(a.date));

    return {
      player,
      opponent,
      total: summarize(encounters),
      byDiscipline: POOL_DISCIPLINES
        .map(discipline => ({ discipline, ...summarize(encounters.filter(e => e.discipline === discipline)) }))
        .filter(record => record.matches > 0),
      encounters,
    };
  }

  // Everyone the player has a ranked match against, sorted by name.
  export function opponentsOf(player: string, matches: ScoredMatch[]): string[] {
    const opponents = matches.flatMap(match =>
      match.playerOne.name === player ? [match.playerTwo.name]
        : match.playerTwo.name === player ? [match.playerOne.name]
          : []);
    return distinctSorted(opponents);
  }

  export function playersIn(matches: ScoredMatch[]): string[] {
    return distinctSorted(matches.flatMap(match => [match.playerOne.name, match.playerTwo.name]));
  }

  function asEncounter(player: string, opponent: string, match: ScoredMatch): HeadToHeadEncounter | null {
    const { date, discipline, source } = match;
    if (match.playerOne.name === player && match.playerTwo.name === opponent) {
      return { date, discipline, source, pointsFor: match.playerOne.points, pointsAgainst: match.playerTwo.points, elo: match.scores.bvf };
    }
    if (match.playerOne.name === opponent && match.playerTwo.name === player) {
      return { date, discipline, source, pointsFor: match.playerTwo.points, pointsAgainst: match.playerOne.points, elo: -match.scores.bvf };
    }
    return null;
  }

  function summarize(encounters: HeadToHeadEncounter[]): HeadToHeadRecord {
    return encounters.reduce((record, e) => ({
      matches: record.matches + 1,
      wins: record.wins + (e.pointsFor > e.pointsAgainst ? 1 : 0),
      losses: record.losses + (e.pointsFor < e.pointsAgainst ? 1 : 0),
      draws: record.draws + (e.pointsFor === e.pointsAgainst ? 1 : 0),
      pointsFor: record.pointsFor + e.pointsFor,
      pointsAgainst: record.pointsAgainst + e.pointsAgainst,
      elo: record.elo + e.elo,
    }), emptyRecord);
  }

  function distinctSorted(names: string[]): string[] {
    return [...new Set(names)].sort((a, b) => a.localeCompare(b));
  }
}

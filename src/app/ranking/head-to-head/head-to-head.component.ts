import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { from, map } from 'rxjs';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { ContentTileComponent } from '../../shared/content-tile/content-tile.component';
import { DateKeyPipe } from '../../tourney-series/date-key.pipe';
import { EloRankingService } from '../elo-ranking.service';
import { HeadToHead } from '../head-to-head';
import { ScoredMatch } from '../models/ranking-match';

type Selection =
  | { kind: 'none' }
  | { kind: 'player'; player: string }
  | { kind: 'pair'; player: string; opponent: string };

@Component({
  templateUrl: './head-to-head.component.html',
  styleUrls: ['./head-to-head.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent, MatFormField, MatLabel, MatSelect, MatOption, MatIconButton, MatIcon, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, DateKeyPipe]
})
export class HeadToHeadComponent {
  private readonly eloRankingService = inject(EloRankingService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly disciplineColumns = ['discipline', 'matches', 'wins', 'points', 'elo'];
  readonly encounterColumns = ['date', 'discipline', 'score', 'elo'];

  private readonly matches = toSignal(
    from(this.eloRankingService.GetAllRankedMatches()),
    { initialValue: [] as ScoredMatch[] });

  // the selection lives in the query params, so that a comparison can be shared as a link
  readonly selection = toSignal(
    this.route.queryParamMap.pipe(map((params): Selection => {
      const player = params.get('p1');
      const opponent = params.get('p2');
      return player && opponent ? { kind: 'pair', player, opponent }
        : player ? { kind: 'player', player }
          : { kind: 'none' };
    })),
    { initialValue: { kind: 'none' } as Selection });

  readonly players = computed(() => HeadToHead.playersIn(this.matches()));

  readonly opponents = computed(() => {
    const selection = this.selection();
    return selection.kind === 'none' ? [] : HeadToHead.opponentsOf(selection.player, this.matches());
  });

  readonly headToHead = computed(() => {
    const selection = this.selection();
    return selection.kind === 'pair'
      ? HeadToHead.of(selection.player, selection.opponent, this.matches())
      : null;
  });

  selectPlayer(player: string): void {
    const selection = this.selection();
    // keep the opponent if the two have played each other
    const opponent = selection.kind === 'pair' && HeadToHead.opponentsOf(player, this.matches()).includes(selection.opponent)
      ? selection.opponent
      : null;
    this.navigate(player, opponent);
  }

  selectOpponent(opponent: string): void {
    const selection = this.selection();
    if (selection.kind !== 'none') {
      this.navigate(selection.player, opponent);
    }
  }

  swap(): void {
    const selection = this.selection();
    if (selection.kind === 'pair') {
      this.navigate(selection.opponent, selection.player);
    }
  }

  playerOf(selection: Selection): string | null {
    return selection.kind === 'none' ? null : selection.player;
  }

  opponentOf(selection: Selection): string | null {
    return selection.kind === 'pair' ? selection.opponent : null;
  }

  private navigate(player: string, opponent: string | null): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { p1: player, p2: opponent },
      replaceUrl: true,
    });
  }
}

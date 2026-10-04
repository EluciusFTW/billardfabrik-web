import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { AuthorizedComponent } from 'src/app/shared/authorized.component';
import { ContentTileComponent } from '../../shared/content-tile/content-tile.component';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { TourneyYearListComponent } from './tourney-year-list.component';

@Component({
  templateUrl: './tourney-list.component.html',
  styleUrls: ['./tourney-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent, MatButton, RouterLink, MatTabGroup, MatTab, TourneyYearListComponent]
})
export class TourneyListComponent extends AuthorizedComponent {
  protected isTourneyAuthenticated = computed(() => this.userService.canHandleTourneys());
}

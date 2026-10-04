import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthorizedComponent } from 'src/app/shared/authorized.component';
import { ContentTileComponent } from '../../shared/content-tile/content-tile.component';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TourneyYearListComponent } from './tourney-year-list.component';

@Component({
  templateUrl: './unique-tourney-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContentTileComponent, MatButton, RouterLink, TourneyYearListComponent]
})
export class UniqueTourneyListComponent extends AuthorizedComponent {
  get isTourneyAuthenticated(): boolean {
    return this.userService.canHandleTourneys();
  }
}

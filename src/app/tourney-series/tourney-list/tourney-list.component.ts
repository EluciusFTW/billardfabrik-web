import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';
import { AuthorizedComponent } from 'src/app/shared/authorized.component';
import { ContentTileComponent } from 'src/app/shared/content-tile/content-tile.component';
import { TourneyYearListComponent } from './tourney-year-list.component';

@Component({
  templateUrl: './tourney-list.component.html',
  styleUrls: ['./tourney-list.component.scss'],
  imports: [ContentTileComponent, MaterialModule, TourneyYearListComponent]
})
export class TourneyListComponent extends AuthorizedComponent {
  get isTourneyAuthenticated(): boolean {
    return this.userService.canHandleTourneys();
  }
}

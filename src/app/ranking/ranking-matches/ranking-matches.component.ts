import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';
import { ContentTileComponent } from 'src/app/shared/content-tile/content-tile.component';
import { RankedChallengesComponent } from './ranked-challenges/ranked-challenges.component';
import { IncomingMatchesComponent } from './incoming-matches/incoming-matches.component';
import { RankedMatchesComponent } from './ranked-tourney-matches/ranked-tourney-matches.component';

@Component({
  selector: 'app-ranking-matches',
  templateUrl: './ranking-matches.component.html',
  imports: [MaterialModule, ContentTileComponent, RankedChallengesComponent, RankedMatchesComponent, IncomingMatchesComponent]
})
export class RankingMatchesComponent { }


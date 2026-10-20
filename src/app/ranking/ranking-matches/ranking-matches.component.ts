import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { RankedMatchesComponent } from './ranked-tourney-matches/ranked-tourney-matches.component';
import { RankedChallengesComponent } from './ranked-challenges/ranked-challenges.component';
import { IncomingMatchesComponent } from './incoming-matches/incoming-matches.component';

@Component({
  selector: 'app-ranking-matches',
  templateUrl: './ranking-matches.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatTabGroup, MatTab, RankedMatchesComponent, RankedChallengesComponent, IncomingMatchesComponent]
})
export class RankingMatchesComponent { }


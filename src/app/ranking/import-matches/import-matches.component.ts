import { Component } from '@angular/core';
import { Tourney } from 'src/app/tourney-series/models/tourney';

@Component({
  templateUrl: './import-matches.component.html',
})
export class ImportMatchesComponent { 
  async considerForElo(tourney: Tourney) {
  
  // if (tourney.meta.status >= TourneyStatus.completed) {
  //   console.log('Importing Players ...');
  //   await this.eloImportService.ImportPlayers(tourney);
  //   console.log('Importing Matches ...');
  //   await this.eloImportService.ImportMatches(tourney);
  // }
  }
}

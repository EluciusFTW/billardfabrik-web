import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { achievements } from 'src/environments/acheivements';

@Component({
  selector: 'app-tourney-achievements',
  templateUrl: './tourney-achievements.component.html',
  styleUrls: ['./tourney-achievements.component.scss']
})
export class TourneyAchievementsComponent {

  achievements = achievements;
  achievementsDataSource = new MatTableDataSource<any>(this.achievements);
  displayAchievements: string[] = ['title', 'criterion', 'prize'];

}

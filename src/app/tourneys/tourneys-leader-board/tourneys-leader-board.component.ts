import { Component, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { LeaderBoardPlayer } from '../models/leaderboard-player';
import { PlayersService } from '../services/players.service';
import { achievements } from 'src/environments/acheivements';

@Component({
  templateUrl: './tourneys-leader-board.component.html',
  styleUrls: ['./tourneys-leader-board.component.scss']
})
export class TourneysLeaderBoardComponent implements OnDestroy {

  leaderBoardPlayers: LeaderBoardPlayer[] = [];
  private leaderBoardSub: Subscription;

  leaderBoardDataSource = new MatTableDataSource<LeaderBoardPlayer>();
  displayedColumns = ['place', 'name', 'placements', 'achievements', 'participations', 'matches', 'score', 'winPercentage', 'points'];
  existingAchievements = achievements;

  constructor(private playersService: PlayersService) {
    this.leaderBoardSub = this.playersService.getAllResults().subscribe(
      leaderBoardPlayers => {
        this.leaderBoardPlayers = leaderBoardPlayers.sort((playerOne, playerTwo) => playerTwo.points - playerOne.points);
        this.leaderBoardDataSource = new MatTableDataSource<LeaderBoardPlayer>(this.leaderBoardPlayers);
      }
    )
  }

  ngOnDestroy(): void {
    if(this.leaderBoardSub){
      this.leaderBoardSub.unsubscribe();
    }
  }
}

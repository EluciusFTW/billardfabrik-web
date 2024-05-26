import { Component, OnInit, inject, input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LeaderBoardPlayer } from '../models/leaderboard-player';
import { TourneyPlayersService } from '../services/tourney-players.service';

@Component({
  selector: 'app-tourney-leader-board',
  templateUrl: './tourneys-leader-board.component.html',
  styleUrls: ['./tourneys-leader-board.component.scss']
})
export class TourneysLeaderBoardComponent implements OnInit {
  playersService = inject(TourneyPlayersService);
  startingAt = input<string>("20180101");
  endingAt = input<string>("20501231");

  leaderBoardPlayers: LeaderBoardPlayer[] = [];

  leaderBoardDataSource = new MatTableDataSource<LeaderBoardPlayer>();
  displayedColumns = ['place', 'name', 'placements', 'participations', 'matches', 'score', 'winPercentage', 'points'];

  async ngOnInit(): Promise<void> {
    let players = await this.playersService.getAllLeaderboardPlayers(this.startingAt(), this.endingAt());

    this.leaderBoardPlayers = players.sort((playerOne, playerTwo) => playerTwo.points - playerOne.points);
    this.leaderBoardDataSource = new MatTableDataSource<LeaderBoardPlayer>(this.leaderBoardPlayers);
  }
}

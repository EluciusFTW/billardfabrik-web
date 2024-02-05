import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { LeaderBoardPlayer } from '../models/leaderboard-player';
import { PlayersService } from '../services/players.service';

@Component({
  selector: 'app-tourney-leader-board',
  templateUrl: './tourneys-leader-board.component.html',
  styleUrls: ['./tourneys-leader-board.component.scss']
})
export class TourneysLeaderBoardComponent implements OnInit {

  @Input()
  startingAt: string = "20180101";

  @Input()
  endingAt: string = "20501231";

  leaderBoardPlayers: LeaderBoardPlayer[] = [];

  leaderBoardDataSource = new MatTableDataSource<LeaderBoardPlayer>();
  displayedColumns = ['place', 'name', 'placements', 'participations', 'matches', 'score', 'winPercentage', 'points'];

  constructor(private playersService: PlayersService) { }

  async ngOnInit(): Promise<void> {
    let players = await this.playersService.getAllLeaderboardPlayers(this.startingAt, this.endingAt);

    this.leaderBoardPlayers = players.sort((playerOne, playerTwo) => playerTwo.points - playerOne.points);
    this.leaderBoardDataSource = new MatTableDataSource<LeaderBoardPlayer>(this.leaderBoardPlayers);
  }
}

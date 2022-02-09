import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { UserService } from 'src/app/authenticated-area/user.service';
import { Match } from '../../models/match';
import { MatchStatus } from '../../models/match-status';
import { Tourney } from '../../models/tourney';
import { TourneyGroup } from '../../models/tourney-group';
import { TourneyPhaseEvent } from '../../models/tourney-phase-event';
import { TourneyPhaseStatus } from '../../models/tourney-phase-status';
import { TourneyGroupStageAddPlayerDialogComponent } from './tourney-group-stage-add-player-dialog.component';

@Component({
  selector: 'app-tourney-group-stage',
  templateUrl: './tourney-group-stage.component.html',
  styleUrls: ['./tourney-group-stage.component.scss']
})
export class TourneyGroupStageComponent {

  @Input()
  tourney: Tourney;

  @Output()
  change: EventEmitter<TourneyPhaseEvent> = new EventEmitter();

  constructor(
    public dialog: MatDialog,
  //  private userService: UserService
  ) { }

  emitChange(event: TourneyPhaseEvent): void {
    this.change.emit(event);
  }

  someGroupFinished(): boolean {
    return this.tourney.groups.some(group => group.status === TourneyPhaseStatus.finalized)
  }

  canAddPlayers(): boolean {
    return true;
    // return this.userService.canHandleTourneys();
  }

  addPlayer(): void {
    const dialogRef = this.dialog.open(TourneyGroupStageAddPlayerDialogComponent, {
      data: {},
      width: '300px',
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe(
      name => {
        if (name) {
          this.inject(name)
        }
      }
    )
  }

  inject(name: any) {
    let group = this.chooseRandomGroup()
    this.addMatches(name, group);
    group.players.push(name);
    this.change.emit(TourneyPhaseEvent.scoreChanged);
  }

  chooseRandomGroup(): TourneyGroup {
    var smallestGroupsize = this.tourney.groups.map(group => group.players.length).sort()[0];
    const viableGroups = this.tourney.groups.filter(group => group.players.length === smallestGroupsize);
    let chosenGroup = viableGroups[Math.floor(Math.random() * viableGroups.length)];

    return chosenGroup;
  }

  addMatches(newPlayerName: any, group: TourneyGroup) {
    var referenceMatch = group.matches[0];
    const matches = group.players
      .map(player => <Match>
        {
          playerOne: { name: newPlayerName, points: 0 },
          playerTwo: { name: player, points: 0 },
          discipline: referenceMatch.discipline,
          length: referenceMatch.length,
          status: MatchStatus.notStarted

        });
    group.matches.push(...matches);
  }
}

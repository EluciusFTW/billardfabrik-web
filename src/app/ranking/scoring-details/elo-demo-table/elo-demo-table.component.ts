import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EloFunctions } from 'src/app/ranking/elo-functions';
import { EloMode } from '../../models/elo-models';

@Component({
  selector: 'app-elo-demo-table',
  templateUrl: './elo-demo-table.component.html',
  styleUrls: ['./elo-demo-table.component.scss']
})
export class EloDemoTableComponent implements OnInit {
  dataSource = new MatTableDataSource<EloScoreDemo>();
  displayedColumns = ['p1', 'p2', 's0', 's1','s2','s3','s4','s5','s6', 's7', 's8'];

  private readonly possibleOpponentScores = [0,1,2,3,4,5,6,7,8];

  @Input()
  EloPairs: EloDemoInput[];

  @Input()
  Caption: string;

  @Input()
  Mode: string;

  ngOnInit() {
    let matches = (this.EloPairs || [])
      .map(pair => ({
        matches: this.possibleOpponentScores.map(score => ({
          p1NormalizedPoints: 9,
          p1Elo: pair.elo1,
          p2NormalizedPoints: score,
          p2Elo: pair.elo2
        })),
        mode: pair.mode
      }))
      .map(batch => ({
        elo1: batch.matches[0].p1Elo,
        elo2: batch.matches[0].p2Elo,
        s: batch.mode
          ? batch.matches.map(match => EloFunctions.calculate(match, batch.mode))
          : batch.matches.map(match => EloFunctions.calculate(match))
      }));

    this.dataSource = new MatTableDataSource<EloScoreDemo>(matches);
  }
}

export type EloDemoInput = {
  elo1: number,
  elo2: number,
  mode?: EloMode
}

type EloScoreDemo = {
  elo1: number,
  elo2: number,
  s: number[],
  mode?: EloMode
}

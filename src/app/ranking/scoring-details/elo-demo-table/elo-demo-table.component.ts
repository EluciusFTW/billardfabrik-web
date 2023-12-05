import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EloFunctions } from 'src/app/tourney-series/services/evaluation/elo-functions';

@Component({
  selector: 'app-elo-demo-table',
  templateUrl: './elo-demo-table.component.html',
  styleUrls: ['./elo-demo-table.component.scss']
})
export class EloDemoTableComponent implements OnInit {
  dataSource = new MatTableDataSource<EloScoreDemo>();
  displayedColumns = ['p1', 'p2', 's0', 's1','s2','s3','s4','s5','s6', 's7', 's8'];

  @Input()
  EloPairs: number[][];

  @Input()
  Caption: string;

  ngOnInit() {
    let matches = (this.EloPairs || [])
      .map(pair => {
        let a: number[] = [];
        for (let i = 0; i<9; i++) {
          a.push(i);
        }
        return a.map(n => ({
          pointsScoredByOne: 9,
          eloScoreOfOne: pair[0],
          pointsScoredByTwo: n,
          eloScoreOfTwo: pair[1]
        }));
      })
      .map(matches => ({
        elo1: matches[0].eloScoreOfOne,
        elo2: matches[0].eloScoreOfTwo,
        s: matches.map(match => EloFunctions.calculate(match))
      }));

    this.dataSource = new MatTableDataSource<EloScoreDemo>(matches);
  }
}

type EloScoreDemo = {
  elo1: number,
  elo2: number,
  s: number[],
}

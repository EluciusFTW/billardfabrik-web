import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';
import { RankingRoutingModule } from './ranking-routing.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    RankingComponent
  ],
  imports: [
    RankingRoutingModule,
    RouterModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    SharedModule
  ]
})
export class RankingModule { }

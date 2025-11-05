import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { AllTourneysComponent } from './all-tourneys.component';
import { AllTourneysRoutingModule } from './all-tourneys-routing.module';


@NgModule({
  imports: [
    AllTourneysRoutingModule,
    RouterModule,
    CommonModule,
    MaterialModule,
    CdkDropList,
    CdkDrag,
    FormsModule,
    SharedModule
  ],
  declarations: [
    AllTourneysComponent,
  ],
  providers: [
  ]
})
export class AllTourneysModule { }

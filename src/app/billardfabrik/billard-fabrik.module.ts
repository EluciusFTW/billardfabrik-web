import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillardFabrikComponent as BillardFabrikComponent } from './billard-fabrik.component';
import { BillardFabrikRoutingModule } from './billard-fabrik-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { BillardFabrikAboutComponent } from './billard-fabrik-about/billard-fabrik-about.component';
import { BillardFabrikMembershipComponent } from './billard-fabrik-membership/billard-fabrik-membership.component';
import { BillardFabrikLeagueComponent } from './billard-fabrik-league/billard-fabrik-league.component';
import { BillardFabrikTrainingComponent } from './billard-fabrik-training/billard-fabrik-training.component';
import { BillardFabrikContactComponent } from './billard-fabrik-contact/billard-fabrik-contact.component';
import { BillardFabrikTourneysComponent } from './billard-tourneys/billard-fabrik-tourneys.component';

@NgModule({
  declarations: [
    BillardFabrikComponent,
    BillardFabrikAboutComponent,
    BillardFabrikMembershipComponent,
    BillardFabrikLeagueComponent,
    BillardFabrikTrainingComponent,
    BillardFabrikContactComponent,
    BillardFabrikTourneysComponent
  ],
  imports: [
    BillardFabrikRoutingModule,
    CommonModule,
    SharedModule,
    MaterialModule,
  ],
  exports: []
})
export class BillardFabrikModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MenuComponent } from './menu/menu.component';
import { BillardFabrikTourneysComponent } from './billard-tourneys/billard-fabrik-tourneys.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/billard-fabrik-contact.component';
import { BillardFabrikLeagueComponent } from './billard-fabrik-league/billard-fabrik-league.component';
import { BillardFabrikMembershipComponent } from './billard-fabrik-membership/billard-fabrik-membership.component';
import { BillardFabrikTrainingComponent } from './billard-fabrik-training/billard-fabrik-training.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AboutComponent,
    BillardFabrikMembershipComponent,
    BillardFabrikLeagueComponent,
    BillardFabrikTrainingComponent,
    ContactComponent,
    BillardFabrikTourneysComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MenuComponent } from './menu/menu.component';
import { BillardFabrikTourneysComponent } from './tourneys/tourneys.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/billard-fabrik-contact.component';
import { LeagueComponent } from './league/league.component';
import { BillardFabrikMembershipComponent } from './membership/membership.component';
import { TrainingComponent } from './training/training.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AboutComponent,
    BillardFabrikMembershipComponent,
    LeagueComponent,
    TrainingComponent,
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

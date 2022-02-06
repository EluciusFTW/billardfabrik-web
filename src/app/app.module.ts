import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// External modules
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from '../secrets/firebase';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './material/material.module';

import { MenuComponent } from './menu/menu.component';
import { BillardFabrikTourneysComponent } from './tourneys/tourneys.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LeagueComponent } from './league/league.component';
import { MembershipComponent } from './membership/membership.component';
import { TrainingComponent } from './training/training.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { TourneysModule } from './tourney-series/tourneys.module';



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AboutComponent,
    MembershipComponent,
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
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    MaterialModule,
    AppRoutingModule,
    TourneysModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { firebaseConfig } from '../secrets/firebase';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './material/material.module';

import { MenuComponent } from './menu/menu.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LeagueComponent } from './league/league.component';
import { MembershipComponent } from './membership/membership.component';
import { TrainingComponent } from './training/training.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { TourneysModule } from './tourney-series/tourneys.module';
import { MensaComponent } from './mensa/mensa.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { FooterComponent } from './footer/footer.component';
import { RankingModule } from './ranking/ranking.module';
import { PlayersModule } from './players/players.module';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AboutComponent,
    MembershipComponent,
    LeagueComponent,
    TrainingComponent,
    ContactComponent,
    MensaComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AuthenticationModule,
    MaterialModule,
    AppRoutingModule,
    TourneysModule,
    RankingModule,
    PlayersModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

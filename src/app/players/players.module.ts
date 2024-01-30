import { NgModule } from "@angular/core";
import { PlayersService } from './players.service';
import { PlayerListingComponent } from './player-listing/player-listing.component';
import { MaterialModule } from "../material/material.module";
import { PlayersRoutingModule } from "./players-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    PlayersRoutingModule,
    MaterialModule
  ],
  exports: [],
  declarations: [
    PlayerListingComponent
  ],
  providers: [
    PlayersService
  ]
})
export class PlayersModule { }

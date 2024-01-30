import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerListingComponent } from './player-listing/player-listing.component';
import { UserGuard } from '../authentication/guards/user.guard';

const routes: Routes = [{
  path: 'players',
  component: PlayerListingComponent,
  canActivate: [UserGuard]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PlayersRoutingModule { }

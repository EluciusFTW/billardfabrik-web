import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTourneysComponent } from './all-tourneys.component';
import { SingleTourneysComponent } from './single-tourneys/single-tourneys.component';

const routes: Routes = [{
  path: '',
  component: AllTourneysComponent,
  children: [
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
    { path: 'single', component: SingleTourneysComponent },
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AllTourneysRoutingModule { }

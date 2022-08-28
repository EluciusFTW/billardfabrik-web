import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './user.service';
import { UserGuard } from './guards/user.guard';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule
  ],
  providers: [
    UserService,
    UserGuard
  ],
  declarations: [LoginDialogComponent],
  entryComponents: [LoginDialogComponent]
})
export class AuthenticationModule { }

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { LoginData } from './models/login-data';
import { OwnMessageService } from '../shared/services/own-message.service';

@Injectable()
export class UserService {

  private uid: string;
  userName: string;

  constructor(
    public authenticationService: AngularFireAuth,
    private messageService: OwnMessageService,
    public dialog: MatDialog,
    private db: AngularFireDatabase,
  ) { }

  isLoggedIn(): boolean {
    return !!this.userName;
  }

  canHandleTourneys(): boolean {
    return this.isLoggedIn();
  }

  login(): void {
    this.dialog
      .open(LoginDialogComponent)
      .afterClosed()
      .pipe(take(1))
      .subscribe(loginData => {
        if (loginData) {
          this.signIn(loginData as LoginData);
        }
      });
  }

  private signIn(loginData: LoginData): void {
    this.authenticationService
      .signInWithEmailAndPassword(loginData.email, loginData.password)
      .then(user => this.getUserInformation(user))
      .catch(_ => {
        this.resetUserData();
        this.messageService.failure('SignIn failed: Wrong Credentials.')
      });
  }

  private getUserInformation(user: any): void {
    this.uid = user.user.uid;
    this.db
      .object('users/' + this.uid)
      .valueChanges()
      .pipe(take(1))
      .subscribe({
        next: userData => {
          this.setUserName(userData);
        },
      });
  };

  private setUserName(userData: any): void {
    this.userName = userData?.displayName || 'No displayName set';
  }

  logout() {
    this.authenticationService.signOut()
    this.resetUserData();
  }

  private resetUserData(): void {
    this.userName = null;
  }
}

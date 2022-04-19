import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { take, first } from 'rxjs/operators';
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

  login(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '400px',
      hasBackdrop: true
    });

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe(loginData => {
        if (loginData) {
          this.signIn(loginData as LoginData);
        }
      });
  }

  signIn(loginData: LoginData): void {
    this.authenticationService
      .signInWithEmailAndPassword(loginData.email, loginData.password)
      .then(user => this.getUserInformation(user))
      .then(user => this.storeUserLogin(user))
      .catch(error => {
        this.resetUserData();
        this.messageService.failure('Wrong Credentials!')
      });
  }

  private getUserInformation(user: any): void {
    this.uid = user.user.uid;
    this.db
      .object('users/' + this.uid)
      .valueChanges()
      .pipe(first())
      .subscribe({
        next: userData => {
          window.console.log('Fetched single user data using object: ', userData);
          this.setUserName(userData);
        },
        error: _ => window.console.log('Could not fetch user data for uid: ' + this.uid)
      });
  };

  private setUserName(userData: any): void {
    this.userName = userData.displayName;
  }

  private storeUserLogin(user: any): void {
    const loginEvent = { 'login': new Date(Date.now()).toLocaleString() };
    this.db.list('/userHistory/' + this.uid).push(loginEvent);
  }

  createUserWithEmailAndPassword(userName: string, passWord: string, displayName: string): void {
    this.authenticationService.createUserWithEmailAndPassword(userName, passWord)
      .then(
        user => this.createUserData(user, displayName),
        error => this.messageService.failure('User kann nicht angelegt werden.', JSON.stringify(error))
      )
      .then(
        () => this.messageService.success('User erfolgreich angelegt!'),
        error => this.messageService.failure('User angelegt, aber Meta-daten nicht!', JSON.stringify(error))
      );
  }

  createUserData(u: any, displayName: string): void {
    const userData = { 'type': 'just-created', 'displayName': displayName };
    this.db.object('users/' + u.uid).set(userData);
  }

  logout() {
    this.authenticationService.signOut()
    this.resetUserData();
  }

  private resetUserData(): void {
    this.userName = null;
  }
}

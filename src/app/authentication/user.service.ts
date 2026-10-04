import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Service, computed, inject, signal } from '@angular/core';
import { Database, objectVal, ref } from '@angular/fire/database';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { LoginData } from './models/login-data';
import { OwnMessageService } from '../shared/services/own-message.service';

@Service()
export class UserService {
  private readonly auth = inject(Auth);
  private readonly messageService = inject(OwnMessageService);
  private readonly dialog = inject(MatDialog);
  private readonly db = inject(Database);

  private uid: string;
  readonly userName = signal<string | null>(null);
  readonly isLoggedIn = computed(() => !!this.userName());
  readonly canHandleTourneys = computed(() => this.isLoggedIn());

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

  logout(): Promise<void> {
    return signOut(this.auth)
      .then(() => this.resetUserData());
  }

  private signIn(loginData: LoginData): Promise<void> {
    return signInWithEmailAndPassword(this.auth, loginData.email, loginData.password)
      .then(user => this.getUserInformation(user))
      .catch(_ => {
        this.resetUserData();
        this.messageService.failure('SignIn failed: Wrong Credentials.')
      });
  }

  private async getUserInformation(user: any): Promise<void> {
    this.uid = user.user.uid;
    const userData = await firstValueFrom(objectVal(ref(this.db, `users/${this.uid}`)));
    this.setUserName(userData);
  }

  private setUserName(userData: any): void {
    this.userName.set(userData?.displayName || 'No displayName set');
  }

  private resetUserData(): void {
    this.userName.set(null);
  }
}

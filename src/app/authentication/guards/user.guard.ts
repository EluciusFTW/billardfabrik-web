import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { OwnMessageService } from '../../shared/services/own-message.service';

@Injectable({ providedIn: 'root' })
export class UserGuard  {
  private userService = inject(UserService);
  private messageService = inject(OwnMessageService);

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const loggedIn = this.userService.isLoggedIn();
    if (!loggedIn) {
      this.messageService.failure('Guard Activated', 'Diese Seite können sie nur als eingeloggter User betreten.');
      return false;
    }
    return loggedIn;
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { OwnMessageService } from '../../shared/services/own-message.service';

@Injectable()
export class UserGuard implements CanActivate {

  constructor(private userService: UserService, private messageService: OwnMessageService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const loggedIn = this.userService.isLoggedIn();
    if (!loggedIn) {
      this.messageService.failure('Guard Activated', 'Diese Seite können sie nur als eingeloggter User betreten.');
      return false;
    }
    return loggedIn;
  }
}

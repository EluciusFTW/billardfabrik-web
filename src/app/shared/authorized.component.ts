import { inject } from '@angular/core';
import { UserService } from '../authentication/user.service';

export abstract class AuthorizedComponent {
  protected readonly userService = inject(UserService);

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
}

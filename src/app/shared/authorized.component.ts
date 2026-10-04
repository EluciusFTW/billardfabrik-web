import { computed, inject } from '@angular/core';
import { UserService } from '../authentication/user.service';

export abstract class AuthorizedComponent {
  protected readonly userService = inject(UserService);
  protected readonly isLoggedIn = computed(() => this.userService.isLoggedIn());
}

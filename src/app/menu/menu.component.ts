import { Component, inject } from '@angular/core';
import { UserService } from '../authentication/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  private readonly userService = inject(UserService);

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
}

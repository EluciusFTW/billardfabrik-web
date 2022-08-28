import { Component } from '@angular/core';
import { UserService } from '../authentication/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(private userService: UserService) {
  }

  login(): void {
    this.userService.login();
  }

  displayName(): string {
    return this.userService.userName;
  }

  logout(): void {
    this.userService.logout();
  }

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
}

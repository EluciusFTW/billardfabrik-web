import { Component, inject } from '@angular/core';
import { AuthorizedComponent } from '../shared/authorized.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends AuthorizedComponent {
  login(): void {
    this.userService.login();
  }

  get displayName(): string {
    return this.userService.userName;
  }

  logout(): void {
    this.userService.logout();
  }
}

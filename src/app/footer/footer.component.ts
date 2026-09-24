import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { AuthorizedComponent } from '../shared/authorized.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatButton]
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

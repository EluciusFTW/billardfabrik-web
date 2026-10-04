import { Component, computed, ChangeDetectionStrategy } from '@angular/core';
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
  displayName = computed(() => this.userService.userName());

  login(): void {
    this.userService.login();
  }

  logout(): void {
    this.userService.logout();
  }
}

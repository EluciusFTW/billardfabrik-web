import { Component, computed, inject } from '@angular/core';
import { AuthorizedComponent } from '../shared/authorized.component';
import { MaterialModule } from '../material/material.module';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [MaterialModule]
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

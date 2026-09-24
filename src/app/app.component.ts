import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MenuComponent, RouterOutlet, FooterComponent]
})
export class AppComponent {
  title = 'billardfabrik-web';
}

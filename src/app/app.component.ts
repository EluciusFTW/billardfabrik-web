import { Component } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from './material/material.module';
import { ContentTileComponent } from './shared/content-tile/content-tile.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [MaterialModule, MenuComponent, FooterComponent, RouterModule]
})
export class AppComponent {
  title = 'billardfabrik-web';
}

import { Component } from '@angular/core';
import { AuthorizedComponent } from '../shared/authorized.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [MaterialModule, RouterModule]
})
export class MenuComponent extends AuthorizedComponent { }

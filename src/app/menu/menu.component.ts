import { Component, inject } from '@angular/core';
import { UserService } from '../authentication/user.service';
import { AuthorizedComponent } from '../shared/authorized.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends AuthorizedComponent { }

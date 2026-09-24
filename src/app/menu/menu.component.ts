import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from '../authentication/user.service';
import { AuthorizedComponent } from '../shared/authorized.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink, RouterLinkActive, MatIcon, MatButton, MatMenuTrigger, MatMenu, MatMenuItem]
})
export class MenuComponent extends AuthorizedComponent { }

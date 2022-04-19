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

  login() : void{
    this.userService.login();
  }

  logout() : void{
    window.console.log('Logout triggered!');
  }

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
}

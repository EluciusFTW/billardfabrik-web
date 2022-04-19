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
    window.console.log('Login triggered!');
  }

  logout() : void{
    window.console.log('Logout triggered!');
  }

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
}

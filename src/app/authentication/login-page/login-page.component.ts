import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  email: string;
  pwd: string;

  constructor(private userService: UserService) { }

  abort(): void {
  }

  login(): void {
    this.userService.signIn({
      email: this.email,
      password: this.pwd
    });
  }
}

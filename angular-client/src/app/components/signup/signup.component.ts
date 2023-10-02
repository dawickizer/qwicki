import { Component } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { AuthStateService } from 'src/app/state/auth/auth.state.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  user: User = new User();

  constructor(private authStateService: AuthStateService) {}

  signup() {
    this.authStateService.signup(new User(this.user), '/');
  }
}

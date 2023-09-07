import { Component } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { UserStateService } from 'src/app/state/user/user.state.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  user: User = new User();

  constructor(private userStateService: UserStateService) {}

  signup() {
    this.userStateService.signup(new User(this.user), '/');
  }
}

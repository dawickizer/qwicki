import { Component } from '@angular/core';
import { AuthFlowService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/state/user/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  user: User = new User();

  constructor(private authFlowService: AuthFlowService) {}

  signup() {
    this.authFlowService.signup(new User(this.user), '/');
  }
}

import { Component } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { Store } from '@ngrx/store';
import { signup } from 'src/app/state/user/user.actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  user: User = new User();

  constructor(private store: Store) {}

  signup() {
    this.store.dispatch(signup({ user: new User(this.user), route: '/' }));
  }
}

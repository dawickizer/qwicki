import { Component, OnDestroy, OnInit } from '@angular/core';
import { Credentials } from 'src/app/models/credentials/credentials';
import { User } from 'src/app/models/user/user';
import { Store } from '@ngrx/store';
import { signup } from 'src/app/state/user/user.actions';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  credentials: Credentials = new Credentials();
  user: User = new User();
  unsubscribe$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  signup() {
    this.store.dispatch(signup({ user: new User(this.user), route: '/' }));
  }
}

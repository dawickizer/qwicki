import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Credentials } from 'src/app/models/credentials/credentials';
import { Store } from '@ngrx/store';
import { login } from 'src/app/state/user/user.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  credentials: Credentials = new Credentials();
  return = '';
  unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(params => (this.return = params['return'] || '/'));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  login() {
    this.store.dispatch(
      login({ credentials: this.credentials, route: this.return })
    );
    this.credentials = { username: '', password: '' };
  }
}

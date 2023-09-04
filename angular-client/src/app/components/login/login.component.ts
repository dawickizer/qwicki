import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Credentials } from 'src/app/models/credentials/credentials';
import { Store } from '@ngrx/store';
import { login } from 'src/app/state/user/user.actions';
import { selectUser, selectUserError } from 'src/app/state/user/user.selectors';
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
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(params => (this.return = params['return'] || '/'));

    this.store
      .select(selectUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if (user) {
          this.router.navigate([this.return]);
        }
      });

    this.store
      .select(selectUserError)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(error => {
        if (error) {
          this.openSnackBar(error, 'Dismiss');
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  login() {
    this.store.dispatch(login({ credentials: this.credentials }));
    this.credentials = { username: '', password: '' };
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}

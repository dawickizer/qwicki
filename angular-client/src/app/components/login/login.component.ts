import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Credentials } from 'src/app/models/credentials/credentials';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthStateService } from 'src/app/state/auth/auth.state.service';

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
    private authStateService: AuthStateService
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
    this.authStateService.login(this.credentials, this.return);
    this.credentials = { username: '', password: '' };
  }
}

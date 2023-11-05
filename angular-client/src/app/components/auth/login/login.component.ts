import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Credentials } from 'src/app/state/auth/credentials.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthOrchestratorService } from 'src/app/state/orchestrator/auth.orchestrator.service';

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
    private authOrchestratorService: AuthOrchestratorService
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
    this.authOrchestratorService
      .login(this.credentials, this.return)
      .subscribe();
    this.credentials = { username: '', password: '' };
  }
}

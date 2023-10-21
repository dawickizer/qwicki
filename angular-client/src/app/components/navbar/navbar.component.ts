import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthOrchestratorService } from 'src/app/state/orchestrator/auth.orchestrator.service';
import { AuthService } from 'src/app/state/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn$: Observable<boolean>;
  unsubscribe$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private authOrchestratorService: AuthOrchestratorService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logout() {
    this.authOrchestratorService
      .logout()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }
}

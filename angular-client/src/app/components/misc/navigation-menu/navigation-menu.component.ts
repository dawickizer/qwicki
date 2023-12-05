import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthOrchestratorService } from 'src/app/state/auth/auth.orchestrator.service';
import { AuthService } from 'src/app/state/auth/auth.service';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.css'],
})
export class NavigationMenuComponent implements OnInit, OnDestroy {
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
    this.authOrchestratorService.logout().subscribe();
  }
}

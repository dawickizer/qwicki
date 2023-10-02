import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthFlowService } from 'src/app/services/auth/auth.service';
import { AuthStateService } from 'src/app/state/auth/auth.state.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(
    private authStateService: AuthStateService,
    private authFlowService: AuthFlowService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authStateService.isLoggedIn$;
  }

  logout() {
    this.authFlowService.logout();
  }
}

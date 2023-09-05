import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth/auth.service';
import { createLogoutAction, logout } from 'src/app/state/user/user.actions';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private store: Store
  ) {}

  logout() {
    this.store.dispatch(logout(createLogoutAction()));
  }

  isLoggedIn() {
    return this.authService.isLoggedInFrontendCheck();
  }
}

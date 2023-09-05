import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { createLogoutAction, logout } from 'src/app/state/user/user.actions';
import { selectIsLoggedIn } from 'src/app/state/user/user.selectors';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isLoggedIn$: Observable<boolean>;

  constructor(private store: Store) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }

  logout() {
    this.store.dispatch(logout(createLogoutAction()));
  }
}

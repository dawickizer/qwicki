import { Component, HostListener } from '@angular/core';
import { createLogoutAction, logout } from './state/user/user.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Qwicki';

  constructor(private store: Store) {}

  // this will call on any browser close...prob need to use
  // broadcast channels to handle if multiple browser tabs
  // are open from the same user..only logout when ALL tabs are closed
  // also this logs user out on browser refresh
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler() {
    this.store.dispatch(logout(createLogoutAction()));
  }
}

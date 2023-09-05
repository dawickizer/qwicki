import { Injectable, NgZone } from '@angular/core';
import { Observable, timer, Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { createLogoutAction, logout } from 'src/app/state/user/user.actions';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private inactivityThreshold = 10000; // 15 minutes
  private logoutThreshold: number = this.inactivityThreshold + 1000 * 5; // inactivityThreshold + 30 seconds
  private inactiveTimer: Observable<number> = timer(this.inactivityThreshold);
  private logoutTimer: Observable<number> = timer(this.logoutThreshold);
  private inactiveTimerSubscription: Subscription = new Subscription();
  private logoutTimerSubscription: Subscription = new Subscription();
  private broadcast: BroadcastChannel = new BroadcastChannel('qwicki');
  private snackBarRef: MatSnackBarRef<any>;

  constructor(
    private snackBar: MatSnackBar,
    private ngZone: NgZone,
    private store: Store
  ) {}

  broadcastEvents = (event: any) => {
    if (event.data === 'logout') {
      this.ngZone.run(() =>
        this.store.dispatch(
          logout(
            createLogoutAction({ makeBackendCall: false, broadcast: false })
          )
        )
      );
    } else if (event.data === 'active') {
      this.ngZone.run(() => this.startTimers());
    }
  };

  setBroadcastEvents() {
    this.broadcast.onmessage = this.broadcastEvents;
  }

  handleActiveEvent = () => {
    this.broadcast.postMessage('active');
    this.startTimers();
  };

  setActiveEvents() {
    window.addEventListener('keydown', this.handleActiveEvent);
    window.addEventListener('wheel', this.handleActiveEvent);
    window.addEventListener('mousemove', this.handleActiveEvent);
    window.addEventListener('pointerdown', this.handleActiveEvent);
  }

  removeActiveEvents() {
    window.removeEventListener('keydown', this.handleActiveEvent);
    window.removeEventListener('wheel', this.handleActiveEvent);
    window.removeEventListener('mousemove', this.handleActiveEvent);
    window.removeEventListener('pointerdown', this.handleActiveEvent);
  }

  startTimers() {
    this.startLogoutTimer();
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
    this.startInactivityTimer();
  }

  stopTimers() {
    this.inactiveTimerSubscription.unsubscribe();
    this.logoutTimerSubscription.unsubscribe();
  }

  startInactivityTimer() {
    this.inactiveTimerSubscription.unsubscribe();
    this.inactiveTimerSubscription = this.inactiveTimer.subscribe(() => {
      this.snackBarRef = this.snackBar.open(
        'Your session is about to expire due to inactivity'
      );
    });
  }

  startLogoutTimer() {
    this.logoutTimerSubscription.unsubscribe();
    this.logoutTimerSubscription = this.logoutTimer.subscribe(() => {
      this.store.dispatch(logout(createLogoutAction()));
      this.snackBarRef = this.snackBar.open(
        'You were logged out due to inactivity',
        '',
        { duration: 5000 }
      );
    });
  }
}

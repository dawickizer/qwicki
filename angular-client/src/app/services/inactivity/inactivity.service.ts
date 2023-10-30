import { Injectable, EventEmitter } from '@angular/core';
import { Observable, timer, Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private inactivityThreshold = 900000; // 15 minutes in milliseconds
  private logoutThreshold = this.inactivityThreshold + 30000; // inactivityThreshold + 30 seconds
  private inactiveTimer: Observable<number> = timer(this.inactivityThreshold);
  private logoutTimer: Observable<number> = timer(this.logoutThreshold);
  private inactiveTimerSubscription: Subscription = new Subscription();
  private logoutTimerSubscription: Subscription = new Subscription();
  private snackBarRef: MatSnackBarRef<any>;

  userInactive: EventEmitter<void> = new EventEmitter();

  constructor(private snackBar: MatSnackBar) {}

  handleActiveEvent = () => {
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
      this.userInactive.emit();
      this.snackBarRef = this.snackBar.open(
        'You were logged out due to inactivity',
        '',
        { duration: 5000 }
      );
    });
  }
}

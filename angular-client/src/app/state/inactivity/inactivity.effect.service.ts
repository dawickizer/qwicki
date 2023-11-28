import { Injectable } from '@angular/core';
import { Observable, timer, Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { InactivityStateService } from './inactivity.state.service';

@Injectable({
  providedIn: 'root',
})
export class InactivityEffectService {
  private inactivityThreshold = 15 * 60 * 1000; // 15 minutes in milliseconds
  private logoutThreshold = this.inactivityThreshold + 30 * 1000; // inactivityThreshold + 30 seconds
  private awayThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds
  private inactiveTimer: Observable<number> = timer(this.inactivityThreshold);
  private logoutTimer: Observable<number> = timer(this.logoutThreshold);
  private awayTimer: Observable<number> = timer(this.awayThreshold);
  private inactiveTimerSubscription: Subscription = new Subscription();
  private logoutTimerSubscription: Subscription = new Subscription();
  private awayTimerSubscription: Subscription = new Subscription();
  private snackBarRef: MatSnackBarRef<any>;
  private handleActiveEvent = () => this.startTimers();

  constructor(
    private inactivityStateService: InactivityStateService,
    private snackBar: MatSnackBar
  ) {}

  start() {
    this.setActiveEvents();
    this.inactivityStateService.setInitialOnlineState();
    this.startTimers();
  }

  stop() {
    this.removeActiveEvents();
    this.inactivityStateService.setInitialOfflineState();
    this.stopTimers();
  }

  private setActiveEvents() {
    window.addEventListener('keydown', this.handleActiveEvent);
    window.addEventListener('wheel', this.handleActiveEvent);
    window.addEventListener('mousemove', this.handleActiveEvent);
    window.addEventListener('pointerdown', this.handleActiveEvent);
  }

  private removeActiveEvents() {
    window.removeEventListener('keydown', this.handleActiveEvent);
    window.removeEventListener('wheel', this.handleActiveEvent);
    window.removeEventListener('mousemove', this.handleActiveEvent);
    window.removeEventListener('pointerdown', this.handleActiveEvent);
  }

  private startTimers() {
    this.inactivityStateService.setInitialOnlineState();
    if (this.snackBarRef) this.snackBarRef.dismiss();
    this.startLogoutTimer();
    this.startInactivityTimer();
    this.startAwayTimer();
  }

  private stopTimers() {
    this.inactiveTimerSubscription.unsubscribe();
    this.logoutTimerSubscription.unsubscribe();
    this.awayTimerSubscription.unsubscribe();
  }

  private startInactivityTimer() {
    this.inactiveTimerSubscription.unsubscribe();
    this.inactiveTimerSubscription = this.inactiveTimer.subscribe(() => {
      this.inactivityStateService.setIsInactive(true);
      this.snackBarRef = this.snackBar.open(
        'Your session is about to expire due to inactivity'
      );
    });
  }

  private startLogoutTimer() {
    this.logoutTimerSubscription.unsubscribe();
    this.logoutTimerSubscription = this.logoutTimer.subscribe(() => {
      this.inactivityStateService.setIsTimedOut(true);
      this.inactivityStateService.setPresence('Offline');
      this.snackBarRef = this.snackBar.open(
        'You were logged out due to inactivity',
        'Dismiss'
      );
    });
  }

  private startAwayTimer() {
    this.awayTimerSubscription.unsubscribe();
    this.awayTimerSubscription = this.awayTimer.subscribe(() => {
      this.inactivityStateService.setIsAway(true);
      this.inactivityStateService.setPresence('Away');
    });
  }
}

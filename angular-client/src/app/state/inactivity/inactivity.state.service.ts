import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  InactivityState,
  initialOfflineState,
  initialOnlineState,
} from './inactivity.state';
import {
  isInactiveSelector,
  isTimedOutSelector,
  isAwaySelector,
  onlineStatusSelector,
} from './inactivity.state.selector';
import { OnlineStatus } from 'src/app/models/online-status/online-status';

@Injectable({
  providedIn: 'root',
})
export class InactivityStateService {
  private _inactivityState = new BehaviorSubject<InactivityState>(
    initialOfflineState
  );
  public inactivityState$: Observable<InactivityState> =
    this._inactivityState.asObservable();
  public isAway$ = isAwaySelector(this.inactivityState$);
  public isInactive$ = isInactiveSelector(this.inactivityState$);
  public isTimedOut$ = isTimedOutSelector(this.inactivityState$);
  public onlineStatus$ = onlineStatusSelector(this.inactivityState$);

  setInitialOfflineState() {
    this._inactivityState.next({ ...initialOfflineState });
  }

  setInitialOnlineState() {
    this._inactivityState.next({ ...initialOnlineState });
  }

  setIsAway(isAway: boolean) {
    this._inactivityState.next({ ...this._inactivityState.value, isAway });
  }

  setIsInactive(isInactive: boolean) {
    this._inactivityState.next({ ...this._inactivityState.value, isInactive });
  }

  setIsTimedOut(isTimedOut: boolean) {
    this._inactivityState.next({ ...this._inactivityState.value, isTimedOut });
  }

  setOnlineStatus(onlineStatus: OnlineStatus) {
    this._inactivityState.next({
      ...this._inactivityState.value,
      onlineStatus,
    });
  }
}

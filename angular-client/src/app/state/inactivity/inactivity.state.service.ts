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
  presenceSelector,
} from './inactivity.state.selector';
import { Presence } from 'src/app/types/presence/presence.type';

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
  public presence$ = presenceSelector(this.inactivityState$);

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

  setPresence(presence: Presence) {
    this._inactivityState.next({
      ...this._inactivityState.value,
      presence,
    });
  }
}

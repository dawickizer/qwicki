import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { InactivityState } from './inactivity.state';
import { OnlineStatus } from 'src/app/models/online-status/online-status';

export const isAwaySelector = (
  inactivityState$: Observable<InactivityState>
): Observable<boolean> =>
  inactivityState$.pipe(
    map(state => state.isAway),
    distinctUntilChanged()
  );

export const isInactiveSelector = (
  inactivityState$: Observable<InactivityState>
): Observable<boolean> =>
  inactivityState$.pipe(
    map(state => state.isInactive),
    distinctUntilChanged()
  );

export const isTimedOutSelector = (
  inactivityState$: Observable<InactivityState>
): Observable<boolean> =>
  inactivityState$.pipe(
    map(state => state.isTimedOut),
    distinctUntilChanged()
  );

export const onlineStatusSelector = (
  inactivityState$: Observable<InactivityState>
): Observable<OnlineStatus> =>
  inactivityState$.pipe(
    map(state => state.onlineStatus),
    distinctUntilChanged()
  );

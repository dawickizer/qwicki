import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { InactivityState } from './inactivity.state';
import { Presence } from 'src/app/models/presence/presence';

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

export const presenceSelector = (
  inactivityState$: Observable<InactivityState>
): Observable<Presence> =>
  inactivityState$.pipe(
    map(state => state.presence),
    distinctUntilChanged()
  );

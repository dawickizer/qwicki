import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { UserState } from './user.state';
import { isEqual } from 'lodash';
import { User } from './user.model';
import {
  Activity,
  GameType,
  QueueType,
  Status,
} from 'src/app/models/status/status.model';
import { Presence } from 'src/app/models/presence/presence';

export const userSelector = (
  userState$: Observable<UserState>
): Observable<User> =>
  userState$.pipe(
    map(state => state.user),
    distinctUntilChanged(isEqual)
  );

export const isLoadingSelector = (
  userState$: Observable<UserState>
): Observable<boolean> =>
  userState$.pipe(
    map(state => state.isLoading),
    distinctUntilChanged()
  );

export const statusSelector = (
  user$: Observable<User | null>
): Observable<Status | null> =>
  user$.pipe(
    map(user => (user ? user.status : null)),
    distinctUntilChanged()
  );

export const presenceSelector = (
  user$: Observable<User | null>
): Observable<Presence | null> =>
  user$.pipe(
    map(user => (user ? user.presence : null)),
    distinctUntilChanged()
  );

export const activitySelector = (
  status$: Observable<Status | null>
): Observable<Activity | null> =>
  status$.pipe(
    map(status => (status ? status.activity : null)),
    distinctUntilChanged()
  );

export const queueTypeSelector = (
  status$: Observable<Status | null>
): Observable<QueueType | null> =>
  status$.pipe(
    map(status => (status ? status.queueType : null)),
    distinctUntilChanged()
  );

export const gameTypeSelector = (
  status$: Observable<Status | null>
): Observable<GameType | null> =>
  status$.pipe(
    map(status => (status ? status.gameType : null)),
    distinctUntilChanged()
  );

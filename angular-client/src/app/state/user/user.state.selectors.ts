import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { UserState } from './user.state';
import { isEqual } from 'lodash';
import { User } from './user.model';

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

export const onlineSelector = (
  user$: Observable<User | null>
): Observable<boolean | null> =>
  user$.pipe(
    map(user => (user ? user.online : null)),
    distinctUntilChanged()
  );

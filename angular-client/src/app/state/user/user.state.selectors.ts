import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { UserState } from './user.state';
import { User } from 'src/app/models/user/user';

export const jwtSelector = (
  userState$: Observable<UserState>
): Observable<string> =>
  userState$.pipe(
    map(state => state.jwt),
    distinctUntilChanged()
  );

export const userSelector = (
  userState$: Observable<UserState>
): Observable<User> =>
  userState$.pipe(
    map(state => state.user),
    distinctUntilChanged()
  );

export const decodedJwtSelector = (
  userState$: Observable<UserState>
): Observable<any> =>
  userState$.pipe(
    map(state => state.decodedJwt),
    distinctUntilChanged()
  );

export const isLoggedInSelector = (
  userState$: Observable<UserState>
): Observable<boolean> =>
  userState$.pipe(
    map(state => state.isLoggedIn),
    distinctUntilChanged()
  );

export const isLoadingSelector = (
  userState$: Observable<UserState>
): Observable<boolean> =>
  userState$.pipe(
    map(state => state.isLoading),
    distinctUntilChanged()
  );

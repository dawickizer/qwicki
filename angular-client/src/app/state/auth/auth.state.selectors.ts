import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { AuthState } from './auth.state';
import { DecodedJwt } from 'src/app/models/decoded-jwt/decoded-jwt';
import { isEqual } from 'lodash';

export const jwtSelector = (
  userState$: Observable<AuthState>
): Observable<string> =>
  userState$.pipe(
    map(state => state.jwt),
    distinctUntilChanged()
  );

export const decodedJwtSelector = (
  userState$: Observable<AuthState>
): Observable<DecodedJwt> =>
  userState$.pipe(
    map(state => state.decodedJwt),
    distinctUntilChanged(isEqual)
  );

export const isLoggedInSelector = (
  userState$: Observable<AuthState>
): Observable<boolean> =>
  userState$.pipe(
    map(state => state.isLoggedIn),
    distinctUntilChanged()
  );

export const isLoadingSelector = (
  userState$: Observable<AuthState>
): Observable<boolean> =>
  userState$.pipe(
    map(state => state.isLoading),
    distinctUntilChanged()
  );

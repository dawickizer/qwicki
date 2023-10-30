import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthState, initialState } from './auth.state';
import {
  decodedJwtSelector,
  isLoadingSelector,
  isLoggedInSelector,
  jwtSelector,
} from './auth.state.selectors';
import { DecodedJwt } from './decoded-jwt.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private _authState = new BehaviorSubject<AuthState>(initialState);

  public authState$: Observable<AuthState> = this._authState.asObservable();
  public jwt$ = jwtSelector(this.authState$);
  public decodedJwt$ = decodedJwtSelector(this.authState$);
  public isLoggedIn$ = isLoggedInSelector(this.authState$);
  public isLoading$ = isLoadingSelector(this.authState$);

  setInitialState() {
    this._authState.next(initialState);
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._authState.value;
    this._authState.next({ ...currentState, isLoading });
  }

  setIsLoggedIn(isLoggedIn: boolean): void {
    const currentState = this._authState.value;
    this._authState.next({ ...currentState, isLoggedIn });
  }

  setJwt(jwt: string): void {
    const currentState = this._authState.value;
    this._authState.next({ ...currentState, jwt });
  }

  setDecodedJwt(decodedJwt: DecodedJwt): void {
    const currentState = this._authState.value;
    this._authState.next({ ...currentState, decodedJwt });
  }
}

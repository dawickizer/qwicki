import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  tap,
  switchMap,
  of,
  catchError,
} from 'rxjs';
import { AuthState, initialState } from './auth.state';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Credentials } from 'src/app/models/credentials/credentials';
import { NavigationExtras, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  decodedJwtSelector,
  isLoadingSelector,
  isLoggedInSelector,
  jwtSelector,
} from './auth.state.selectors';
import { InactivityService } from 'src/app/services/inactivity/inactivity.service';
import { MatchMakingService } from 'src/app/services/match-making/match-making.service';
import { DecodedJwt } from 'src/app/models/decoded-jwt/decoded-jwt';
import { User } from '../user/user.model';

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

  constructor(
    private authService: AuthService,
    private inactivityService: InactivityService,
    private matchMakingService: MatchMakingService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.listenToInactivityEvents();
  }

  private listenToInactivityEvents(): void {
    this.inactivityService.userInactive.subscribe(() => {
      this.logout();
    });
  }

  login(credentials: Credentials): Observable<DecodedJwt> {
    this.setIsLoading(true);
    return this.authService.login(credentials).pipe(
      tap((response: Credentials) => {
        this.setJwt(response.token);
      }),
      switchMap(() => this.authService.currentUser()),
      tap(decodedJwt => {
        this.setDecodedJwt(decodedJwt);
        this.setIsLoggedIn(true);
        this.setIsLoading(false);
      }),
      catchError(this.handleError)
    );
  }

  signup(user: User): Observable<DecodedJwt> {
    this.setIsLoading(true);
    return this.authService.signup(user).pipe(
      tap((response: Credentials) => {
        this.setJwt(response.token);
      }),
      switchMap(() => this.authService.currentUser()),
      tap(decodedJwt => {
        this.setDecodedJwt(decodedJwt);
        this.setIsLoggedIn(true);
        this.setIsLoading(false);
      }),
      catchError(this.handleError)
    );
  }

  isLoggedIn(): Observable<boolean> {
    this.setIsLoading(true);
    return this.authService.isLoggedIn().pipe(
      tap(isLoggedIn => {
        this.setIsLoggedIn(isLoggedIn);
        if (isLoggedIn) {
          this.inactivityService.setActiveEvents();
          this.inactivityService.handleActiveEvent();
        }
        this.setIsLoading(false);
      }),
      catchError(error => {
        this.snackBar.open(error, 'Dismiss', { duration: 5000 });
        this.setIsLoggedIn(false);
        this.setIsLoading(false);
        return of(false);
      })
    );
  }

  logout(
    options: { extras?: NavigationExtras; makeBackendCall?: boolean } = {}
  ): void {
    this.setIsLoading(true);
    const { extras, makeBackendCall = true } = options;
    const logoutCall$ = makeBackendCall ? this.authService.logout() : of(null);

    logoutCall$
      .pipe(
        tap(() => {
          this.inactivityService.removeActiveEvents();
          this.inactivityService.stopTimers();
          this.matchMakingService.leaveGameRoom();
          this.setInitialState();
          this.router.navigate(['auth/login'], extras);
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

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

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.setIsLoading(false);
    return of(null);
  };
}

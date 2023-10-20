import { Injectable } from '@angular/core';
import { Observable, tap, switchMap, of, catchError } from 'rxjs';
import { Credentials } from 'src/app/state/auth/credentials.model';
import { NavigationExtras, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InactivityService } from 'src/app/services/inactivity/inactivity.service';
import { MatchMakingService } from 'src/app/services/match-making/match-making.service';
import { User } from '../user/user.model';
import { AuthStateService } from './auth.state.service';
import { AuthApiService } from './auth.api.service';
import { DecodedJwt } from './decoded-jwt.model';

@Injectable({
  providedIn: 'root',
})
export class AuthEffectService {
  constructor(
    private authApiService: AuthApiService,
    private authStateService: AuthStateService,
    private inactivityService: InactivityService,
    private matchMakingService: MatchMakingService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.listenToInactivityEvents();
  }

  private listenToInactivityEvents(): void {
    this.inactivityService.userInactive.subscribe(() => {
      this.logout().subscribe();
    });
  }

  login(credentials: Credentials): Observable<DecodedJwt> {
    this.authStateService.setIsLoading(true);
    return this.authApiService.login(credentials).pipe(
      tap((response: Credentials) => {
        this.authStateService.setJwt(response.token);
      }),
      switchMap(() => this.authApiService.currentUser()),
      tap(decodedJwt => {
        this.authStateService.setDecodedJwt(decodedJwt);
        this.authStateService.setIsLoggedIn(true);
        this.authStateService.setIsLoading(false);
      }),
      catchError(this.handleError)
    );
  }

  signup(user: User): Observable<DecodedJwt> {
    this.authStateService.setIsLoading(true);
    return this.authApiService.signup(user).pipe(
      tap((response: Credentials) => {
        this.authStateService.setJwt(response.token);
      }),
      switchMap(() => this.authApiService.currentUser()),
      tap(decodedJwt => {
        this.authStateService.setDecodedJwt(decodedJwt);
        this.authStateService.setIsLoggedIn(true);
        this.authStateService.setIsLoading(false);
      }),
      catchError(this.handleError)
    );
  }

  isLoggedIn(): Observable<boolean> {
    this.authStateService.setIsLoading(true);
    return this.authApiService.isLoggedIn().pipe(
      tap(isLoggedIn => {
        this.authStateService.setIsLoggedIn(isLoggedIn);
        if (isLoggedIn) {
          this.inactivityService.setActiveEvents();
          this.inactivityService.handleActiveEvent();
        }
        this.authStateService.setIsLoading(false);
      }),
      catchError(error => {
        this.snackBar.open(error, 'Dismiss', { duration: 5000 });
        this.authStateService.setIsLoggedIn(false);
        this.authStateService.setIsLoading(false);
        return of(false);
      })
    );
  }

  logout(
    options: { extras?: NavigationExtras; makeBackendCall?: boolean } = {}
  ): Observable<any> {
    this.authStateService.setIsLoading(true);
    const { extras, makeBackendCall = true } = options;
    const logoutCall$ = makeBackendCall
      ? this.authApiService.logout()
      : of(null);

    return logoutCall$.pipe(
      tap(() => {
        this.inactivityService.removeActiveEvents();
        this.inactivityService.stopTimers();
        this.matchMakingService.leaveGameRoom();
        this.authStateService.setInitialState();
        this.router.navigate(['auth/login'], extras);
      }),
      catchError(this.handleError)
    );
  }

  private handleError = (error: any): Observable<null> => {
    console.error(error);
    this.snackBar.open(error, 'Dismiss', { duration: 5000 });
    this.authStateService.setIsLoading(false);
    return of(null);
  };
}

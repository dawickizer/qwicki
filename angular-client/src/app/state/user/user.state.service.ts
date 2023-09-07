import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  tap,
  switchMap,
  of,
  catchError,
} from 'rxjs';
import { UserState, initialState } from './user.state';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { Credentials } from 'src/app/models/credentials/credentials';
import { NavigationExtras, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  decodedJwtSelector,
  isLoadingSelector,
  isLoggedInSelector,
  jwtSelector,
  userSelector,
} from './user.state.selectors';
import { InactivityService } from 'src/app/services/inactivity/inactivity.service';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { MatchMakingService } from 'src/app/services/match-making/match-making.service';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private _userState = new BehaviorSubject<UserState>(initialState);

  public userState$: Observable<UserState> = this._userState.asObservable();
  public user$ = userSelector(this.userState$);
  public jwt$ = jwtSelector(this.userState$);
  public decodedJwt$ = decodedJwtSelector(this.userState$);
  public isLoggedIn$ = isLoggedInSelector(this.userState$);
  public isLoading$ = isLoadingSelector(this.userState$);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private inactivityService: InactivityService,
    private colyseusService: ColyseusService,
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

  login(credentials: Credentials, route: string): void {
    this.setIsLoading(true);
    this.authService
      .login(credentials)
      .pipe(
        tap((response: Credentials) => {
          this.setJwt(response.token);
        }),
        switchMap(() => {
          return this.authService.currentUser();
        }),
        tap((decodedJwt: any) => {
          this.setDecodedJwt(decodedJwt);
        }),
        switchMap(decodedJwt => {
          return this.userService.get(decodedJwt._id);
        }),
        tap((user: User) => {
          this.setUser(user);
          this.setIsLoggedIn(true);
          this.setIsLoading(false);
          this.router.navigate([route]);
        }),
        catchError(error => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
          this.setIsLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  signup(user: User, route: string): void {
    this.setIsLoading(true);
    this.authService
      .signup(user)
      .pipe(
        tap((response: Credentials) => {
          this.setJwt(response.token);
        }),
        switchMap(() => {
          return this.authService.currentUser();
        }),
        tap((decodedJwt: any) => {
          this.setDecodedJwt(decodedJwt);
        }),
        switchMap(decodedJwt => {
          return this.userService.get(decodedJwt._id);
        }),
        tap((user: User) => {
          this.setUser(user);
          this.setIsLoggedIn(true);
          this.setIsLoading(false);
          this.router.navigate([route]);
        }),
        catchError(error => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
          this.setIsLoading(false);
          return of(null);
        })
      )
      .subscribe();
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
          this.colyseusService.leaveAllRooms();
          this.matchMakingService.leaveGameRoom();
          this.setInitialState();
          this.router.navigate(['auth/login'], extras);
        }),
        catchError(error => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
          this.setIsLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  updateUser(user: User): void {
    this.setIsLoading(true);
    this.userService
      .update(user)
      .pipe(
        tap(user => {
          this.setUser(user);
          this.setIsLoading(false);
          this.snackBar.open(
            'Your information has been successfully updated!',
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(error => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
          this.setIsLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  deleteUser(user: User): void {
    this.setIsLoading(true);
    this.userService
      .delete(user)
      .pipe(
        tap(() => {
          this.setUser(null);
          this.setIsLoading(false);
          this.snackBar.open(
            'Your account has been successfully deleted!',
            'Dismiss',
            { duration: 5000 }
          );
        }),
        catchError(error => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
          this.setIsLoading(false);
          return of(null);
        })
      )
      .subscribe();
  }

  setInitialState() {
    this._userState.next(initialState);
  }

  setUser(user: User): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, user });
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, isLoading });
  }

  setIsLoggedIn(isLoggedIn: boolean): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, isLoggedIn });
  }

  setJwt(jwt: string): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, jwt });
  }

  setDecodedJwt(decodedJwt: string): void {
    const currentState = this._userState.value;
    this._userState.next({ ...currentState, decodedJwt });
  }
}

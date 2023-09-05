import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import {
  login,
  loginSuccess,
  loginFailure,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
  deleteUserSuccess,
  deleteUserFailure,
  deleteUser,
  signup,
  signupSuccess,
  signupFailure,
  logout,
  createLogoutAction,
  checkIsLoggedIn,
  checkIsLoggedInFailure,
  checkIsLoggedInSuccess,
} from './user.actions';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { InactivityService } from 'src/app/services/inactivity/inactivity.service';
import { MatchMakingService } from 'src/app/services/match-making/match-making.service';

@Injectable()
export class UserEffects {
  signup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(signup),
      exhaustMap(action =>
        this.authService.signup(action.user).pipe(
          tap(credentials => this.setSession(credentials.token)),
          switchMap(() => this.authService.currentUser()),
          switchMap(decodedJWT => this.userService.get(decodedJWT._id)),
          map(user => signupSuccess({ user, route: action.route })),
          catchError(error => of(signupFailure({ error })))
        )
      )
    );
  });

  handleSignupSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(signupSuccess),
        tap(({ route }) => {
          this.router.navigate([route]);
        })
      );
    },
    { dispatch: false }
  );

  handleSignupFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(signupFailure),
        tap(({ error }) => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
        })
      );
    },
    { dispatch: false }
  );

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(login),
      exhaustMap(action =>
        this.authService.login(action.credentials).pipe(
          tap(credentials => this.setSession(credentials.token)),
          switchMap(() => this.authService.currentUser()),
          switchMap(decodedJWT => this.userService.get(decodedJWT._id)),
          map(user => loginSuccess({ user, route: action.route })),
          catchError(error => of(loginFailure({ error })))
        )
      )
    );
  });

  handleLoginSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(loginSuccess),
        tap(({ route }) => {
          this.router.navigate([route]);
        })
      );
    },
    { dispatch: false }
  );

  handleLoginFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(loginFailure),
        tap(({ error }) => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
        })
      );
    },
    { dispatch: false }
  );

  checkIsLoggedIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(checkIsLoggedIn),
      switchMap(() =>
        this.authService.isLoggedIn().pipe(
          map(isLoggedIn => checkIsLoggedInSuccess({ isLoggedIn })),
          catchError(error => of(checkIsLoggedInFailure({ error })))
        )
      )
    );
  });

  handleCheckIsLoggedInSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(checkIsLoggedInSuccess),
        tap(({ isLoggedIn }) => {
          if (isLoggedIn) {
            this.inactivityService.setBroadcastEvents();
            this.inactivityService.setActiveEvents();
            this.inactivityService.handleActiveEvent();
          }
        })
      );
    },
    { dispatch: false }
  );

  handleCheckIsLoggedInFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(checkIsLoggedInFailure),
        tap(({ error }) => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
        })
      );
    },
    { dispatch: false }
  );

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(logout),
        tap(action => {
          if (action.makeBackendCall) {
            this.authService.logout().subscribe(); // Consider moving this to a mergeMap if you want to handle success/failure
          }

          localStorage.removeItem('id_token');
          this.inactivityService.removeActiveEvents();
          this.inactivityService.stopTimers();

          if (action.broadcast) {
            this.colyseusService.leaveAllRooms();
            this.matchMakingService.leaveGameRoom();
            this.authService.broadcast.postMessage('logout');
          }

          this.router.navigate(['auth/login'], action.extras);
        })
      );
    },
    { dispatch: false }
  );

  updateUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateUser),
      exhaustMap(action =>
        this.userService.update(action.user).pipe(
          map(user => updateUserSuccess({ user })),
          catchError(error => of(updateUserFailure({ error })))
        )
      )
    );
  });

  handleUpdateUserSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(updateUserSuccess),
        tap(() => {
          this.snackBar.open(
            'Your information has been successfully updated!',
            'Dismiss',
            { duration: 5000 }
          );
        })
      );
    },
    { dispatch: false }
  );

  handleUpdateUserFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(updateUserFailure),
        tap(({ error }) => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
        })
      );
    },
    { dispatch: false }
  );

  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteUser),
      exhaustMap(action =>
        this.userService.delete(action.user).pipe(
          map(data => deleteUserSuccess({ data })),
          catchError(error => of(deleteUserFailure({ error })))
        )
      )
    );
  });

  handleDeleteUserSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteUserSuccess),
      tap(() => {
        this.snackBar.open(
          'Your account has been successfully deleted!',
          'Dismiss',
          { duration: 5000 }
        );
      }),
      map(() => logout(createLogoutAction()))
    );
  });

  handleDeleteUserFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(deleteUserFailure),
        tap(({ error }) => {
          this.snackBar.open(error, 'Dismiss', { duration: 5000 });
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private colyseusService: ColyseusService,
    private inactivityService: InactivityService,
    private matchMakingService: MatchMakingService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  private setSession(token: string) {
    localStorage.setItem('id_token', token as string);
  }
}

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
} from './user.actions';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
  signup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(signup),
      exhaustMap(action =>
        this.authService.signup(action.user).pipe(
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

  handleSignupError$ = createEffect(
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

  handleLoginError$ = createEffect(
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

  handleUpdateUserError$ = createEffect(
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

  handleDeleteUserSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(deleteUserSuccess),
        tap(() => {
          this.authService.logout();
          this.snackBar.open(
            'Your account has been successfully deleted!',
            'Dismiss',
            { duration: 5000 }
          );
        })
      );
    },
    { dispatch: false }
  );

  handleDeleteUserError$ = createEffect(
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
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
}

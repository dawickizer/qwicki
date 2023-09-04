import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import { login, loginSuccess, loginFailure } from './user.actions';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Injectable()
export class UserEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(login),
      exhaustMap(action =>
        this.authService.login(action.credentials).pipe(
          switchMap(() => this.authService.currentUser()),
          switchMap(decodedJWT => this.userService.get(decodedJWT._id)),
          map(user => loginSuccess({ user })),
          catchError(error => of(loginFailure({ error })))
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private userService: UserService
  ) {}
}

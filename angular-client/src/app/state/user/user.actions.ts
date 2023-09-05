import { NavigationExtras } from '@angular/router';
import { createAction, props } from '@ngrx/store';
import { Credentials } from 'src/app/models/credentials/credentials';
import { User } from 'src/app/models/user/user';

export const signup = createAction(
  '[User] Signup',
  props<{ user: User; route: any }>()
);

export const signupSuccess = createAction(
  '[User] Signup Success',
  props<{ user: User; route: any }>()
);

export const signupFailure = createAction(
  '[User] Signup Failure',
  props<{ error: any }>()
);

export const login = createAction(
  '[User] Login',
  props<{ credentials: Credentials; route: any }>()
);

export const loginSuccess = createAction(
  '[User] Login Success',
  props<{ user: User; route: any }>()
);

export const loginFailure = createAction(
  '[User] Login Failure',
  props<{ error: any }>()
);

export function createLogoutAction(options?: {
  extras?: NavigationExtras;
  makeBackendCall?: boolean;
  broadcast?: boolean;
}) {
  return {
    extras: options?.extras,
    makeBackendCall: options?.makeBackendCall ?? true,
    broadcast: options?.broadcast ?? true,
  };
}

export const logout = createAction(
  '[User] Logout',
  props<{
    extras?: NavigationExtras;
    makeBackendCall?: boolean;
    broadcast?: boolean;
  }>()
);

export const updateUser = createAction(
  '[User] Update',
  props<{ user: User }>()
);

export const updateUserSuccess = createAction(
  '[User] Update Success',
  props<{ user: User }>()
);

export const updateUserFailure = createAction(
  '[User] Update Failure',
  props<{ error: any }>()
);

export const deleteUser = createAction(
  '[User] Delete',
  props<{ user: User }>()
);

export const deleteUserSuccess = createAction(
  '[User] Delete Success',
  props<{ data: any }>()
);

export const deleteUserFailure = createAction(
  '[User] Delete Failure',
  props<{ error: any }>()
);

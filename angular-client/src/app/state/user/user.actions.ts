import { createAction, props } from '@ngrx/store';
import { Credentials } from 'src/app/models/credentials/credentials';
import { User } from 'src/app/models/user/user';

export const login = createAction(
  '[User] Login',
  props<{ credentials: Credentials }>()
);

export const loginSuccess = createAction(
  '[User] Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[User] Login Failure',
  props<{ error: any }>()
);

export const logout = createAction('[User] Logout');

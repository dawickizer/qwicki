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

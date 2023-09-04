import { createReducer, on } from '@ngrx/store';
import {
  deleteUser,
  deleteUserFailure,
  deleteUserSuccess,
  login,
  loginFailure,
  loginSuccess,
  logout,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
} from './user.actions';
import { UserState } from './user.state';

export const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,
  on(login, state => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoading: false,
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(logout, state => initialState),
  on(updateUser, state => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(updateUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoading: false,
  })),
  on(updateUserFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(deleteUser, state => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(deleteUserSuccess, state => initialState),
  on(deleteUserFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  }))
);

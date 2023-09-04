import { createReducer, on } from '@ngrx/store';
import { login, loginFailure, loginSuccess, logout } from './user.actions';
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
  on(logout, state => initialState)
);

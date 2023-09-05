import { createReducer, on } from '@ngrx/store';
import {
  checkIsLoggedIn,
  checkIsLoggedInFailure,
  checkIsLoggedInSuccess,
  deleteUser,
  deleteUserFailure,
  deleteUserSuccess,
  login,
  loginFailure,
  loginSuccess,
  logout,
  saveJWT,
  signup,
  signupFailure,
  signupSuccess,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
} from './user.actions';
import { UserState } from './user.state';

export const initialState: UserState = {
  user: null,
  JWT: null,
  decodedJWT: null,
  isLoading: false,
  isLoggedIn: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,
  on(saveJWT, (state, { JWT }) => ({
    ...state,
    JWT,
  })),
  on(signup, state => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(signupSuccess, (state, { user, decodedJWT }) => ({
    ...state,
    user,
    decodedJWT,
    isLoggedIn: true,
    isLoading: false,
  })),
  on(signupFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(login, state => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(loginSuccess, (state, { user, decodedJWT }) => ({
    ...state,
    user,
    decodedJWT,
    isLoggedIn: true,
    isLoading: false,
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(checkIsLoggedIn, state => ({
    ...state,
    isLoading: true,
  })),
  on(checkIsLoggedInSuccess, (state, { isLoggedIn }) => ({
    ...state,
    isLoggedIn,
    isLoading: false,
  })),
  on(checkIsLoggedInFailure, (state, { error }) => ({
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

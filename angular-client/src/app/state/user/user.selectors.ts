import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';

const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => state.user
);

export const selectJWT = createSelector(
  selectUserState,
  (state: UserState) => state.JWT
);

export const selectDecodedJWT = createSelector(
  selectUserState,
  (state: UserState) => state.decodedJWT
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state: UserState) => state.isLoading
);

export const selectIsLoggedIn = createSelector(
  selectUserState,
  (state: UserState) => state.isLoggedIn
);

export const selectUserError = createSelector(
  selectUserState,
  (state: UserState) => state.error
);

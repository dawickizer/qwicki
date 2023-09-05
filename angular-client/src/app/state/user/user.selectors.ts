import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';

// Step 1: Create a feature selector
const selectUserState = createFeatureSelector<UserState>('user');

// Step 2: Create selectors for each piece of the state
export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => state.user
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

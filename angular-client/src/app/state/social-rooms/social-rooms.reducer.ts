import { createReducer, on } from '@ngrx/store';
import { initialState } from './soical-rooms.state';
import { establishHost } from './social-rooms.actions';

export const socialRoomsReducer = createReducer(
  initialState,
  on(establishHost, state => ({
    ...state,
  }))
);

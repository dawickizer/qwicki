import { createReducer, on } from '@ngrx/store';
import { initialState } from './soical-rooms.state';
import { createPersonalRoom, createPersonalRoomFailure, createPersonalRoomSuccess } from './social-rooms.actions';

export const socialRoomsReducer = createReducer(
  initialState,
  on(createPersonalRoom, state => ({
    ...state,
    isLoading: true
  })),
  on(createPersonalRoomSuccess, state => ({
    ...state,
    isLoading: false
  })),
  on(createPersonalRoomFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);

import { createAction, props } from '@ngrx/store';
import * as Colyseus from 'colyseus.js';

// social-rooms.actions.ts
export const createPersonalRoom = createAction(
  '[Social Rooms] Create Personal Room'
);

export const createPersonalRoomSuccess = createAction(
  '[Social Rooms] Create Personal Room Success',
  props<{ room: Colyseus.Room }>()
);

export const createPersonalRoomFailure = createAction(
  '[Social Rooms] Create Personal Room Failure',
  props<{ error: any }>()
);

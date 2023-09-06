import { createAction, props } from '@ngrx/store';
import * as Colyseus from 'colyseus.js';

export const establishHost = createAction(
  '[SocialRooms] Establish Host',
  props<{ hostJWT: any }>()
);

export const establishOnlineFriendsRooms = createAction(
  '[SocialRooms] Establish Online Friends Rooms'
);

export const roomCreated = createAction(
  '[SocialRooms] Room Created',
  props<{ room: Colyseus.Room }>()
);

export const roomJoined = createAction(
  '[SocialRooms] Room Joined',
  props<{ room: Colyseus.Room }>()
);

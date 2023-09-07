import * as Colyseus from 'colyseus.js';

export interface SocialRoomsState {
  personalRoom: Colyseus.Room | null;
  connectedRooms: Colyseus.Room[];
  isLoading: boolean;
}

export const initialState: SocialRoomsState = {
  personalRoom: null,
  connectedRooms: [],
  isLoading: false,
};

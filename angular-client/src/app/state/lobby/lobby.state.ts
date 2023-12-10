import { Lobby } from './lobby.model';

export interface LobbyState {
  lobby: Lobby | null;
  isLoading: boolean;
}

export const initialState: LobbyState = {
  lobby: null,
  isLoading: false,
};

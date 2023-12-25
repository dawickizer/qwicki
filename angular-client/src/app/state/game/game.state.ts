import { Game } from './game.model';

export interface GameState {
  game: Game | null;
  isLoading: boolean;
}

export const initialState: GameState = {
  game: null,
  isLoading: false,
};

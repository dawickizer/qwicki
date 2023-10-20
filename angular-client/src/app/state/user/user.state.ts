import { User } from './user.model';

export interface UserState {
  user: User | null;
  isLoading: boolean;
}

export const initialState: UserState = {
  user: null,
  isLoading: false,
};

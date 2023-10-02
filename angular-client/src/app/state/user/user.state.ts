import { User } from 'src/app/models/user/user';

export interface UserState {
  user: User | null;
  isLoading: boolean;
}

export const initialState: UserState = {
  user: null,
  isLoading: false,
};

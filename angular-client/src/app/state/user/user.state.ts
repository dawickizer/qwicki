import { User } from 'src/app/models/user/user';

export interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  jwt: string;
  decodedJwt: string | null;
}

export const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  jwt: '',
  decodedJwt: null,
};

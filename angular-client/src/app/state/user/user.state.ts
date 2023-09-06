import { User } from 'src/app/models/user/user';

export interface UserState {
  user: User | null;
  JWT: string | null;
  decodedJWT: any | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  error: any;
}

export const initialState: UserState = {
  user: null,
  JWT: null,
  decodedJWT: null,
  isLoading: false,
  isLoggedIn: false,
  error: null,
};

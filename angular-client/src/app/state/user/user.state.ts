import { DecodedJwt } from 'src/app/models/decoded-jwt/decoded-jwt';
import { User } from 'src/app/models/user/user';

export interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  jwt: string;
  decodedJwt: DecodedJwt | null;
}

export const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  jwt: '',
  decodedJwt: null,
};

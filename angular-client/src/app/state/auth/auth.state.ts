import { DecodedJwt } from 'src/app/models/decoded-jwt/decoded-jwt';

export interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  jwt: string;
  decodedJwt: DecodedJwt | null;
}

export const initialState: AuthState = {
  isLoggedIn: false,
  isLoading: false,
  jwt: '',
  decodedJwt: null,
};

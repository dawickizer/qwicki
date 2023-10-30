import { DecodedJwt } from './decoded-jwt.model';

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

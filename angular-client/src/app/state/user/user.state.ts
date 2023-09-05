import { User } from 'src/app/models/user/user';

export interface UserState {
  user: User | null;
  JWT: string | null;
  decodedJWT: any | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  error: any;
}

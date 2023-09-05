import { User } from 'src/app/models/user/user';

export interface UserState {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  error: any;
}

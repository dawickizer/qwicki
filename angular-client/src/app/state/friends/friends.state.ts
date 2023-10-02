import { Friend } from 'src/app/models/friend/friend';

export interface FriendsState {
  friends: Friend[] | null;
  isLoading: boolean;
}

export const initialState: FriendsState = {
  friends: [],
  isLoading: false,
};

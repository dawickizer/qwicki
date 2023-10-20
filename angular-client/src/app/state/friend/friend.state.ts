import { Friend } from './friend.model';

export interface FriendState {
  friends: Friend[] | null;
  isLoading: boolean;
}

export const initialState: FriendState = {
  friends: [],
  isLoading: false,
};

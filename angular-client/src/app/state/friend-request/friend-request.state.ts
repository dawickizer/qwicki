import { FriendRequest } from 'src/app/models/friend-request/friend-request';

export interface FriendRequestState {
  inboundFriendRequests: FriendRequest[] | null;
  outboundFriendRequests: FriendRequest[] | null;
  isLoading: boolean;
}

export const initialState: FriendRequestState = {
  inboundFriendRequests: [],
  outboundFriendRequests: [],
  isLoading: false,
};

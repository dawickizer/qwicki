import { FriendRequest } from 'src/app/models/friend-request/friend-request';

export interface FriendRequestsState {
  inboundFriendRequests: FriendRequest[] | null;
  outboundFriendRequests: FriendRequest[] | null;
  isLoading: boolean;
}

export const initialState: FriendRequestsState = {
  inboundFriendRequests: [],
  outboundFriendRequests: [],
  isLoading: false,
};

import { FriendRequest } from 'src/app/state/friend-request/friend-requests.model';

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

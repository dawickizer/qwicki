import { FriendRequest } from "../friend-request/friend-request";

export class User {
  _id?: string;
  username: string;
  password: string;
  role?: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  online: boolean;
  friends: User[] = [];
  inboundFriendRequests: FriendRequest[] = [];
  outboundFriendRequests: FriendRequest[] = [];
}
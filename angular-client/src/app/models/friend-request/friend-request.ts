import { Friend } from "../friend/friend";

export class FriendRequest {
  _id?: string;
  createdAt: Date;
  from: Friend
  to: Friend;
  accepted: boolean;
}
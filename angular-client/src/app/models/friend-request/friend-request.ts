import { Friend } from "../friend/friend";
import { User } from "../user/user";

export class FriendRequest {
  _id?: string;
  createdAt: Date = new Date();
  from: Friend
  to: Friend;
  accepted: boolean = false;

  constructor(from?: Friend, to?: Friend) {
    this.from = from;
    this.to = to;
  }
}
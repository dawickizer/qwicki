import { Friend } from '../friend/friend.model';

export class FriendRequest {
  _id?: string;
  createdAt: Date;
  from: Friend;
  to: Friend;
  accepted: boolean;

  constructor(friendRequest?: Partial<FriendRequest>) {
    if (friendRequest) {
      this._id = friendRequest._id;
      this.createdAt = friendRequest.createdAt;
      this.from = new Friend(friendRequest.from);
      this.to = new Friend(friendRequest.to);
      this.accepted = friendRequest.accepted ?? false;
    }
  }
}

import { Notification } from 'src/app/models/notification/notification';
import { Friend } from '../friend/friend.model';

export class FriendRequest extends Notification {
  accepted: boolean;
  override type: 'friend-request';

  constructor(friendRequest?: Partial<FriendRequest>) {
    super();
    if (friendRequest) {
      this._id = friendRequest._id;
      this.createdAt = friendRequest.createdAt;
      this.from = new Friend(friendRequest.from);
      this.to = new Friend(friendRequest.to);
      this.accepted = friendRequest.accepted ?? false;
      this.type = friendRequest.type ?? 'friend-request';
    }
  }
}

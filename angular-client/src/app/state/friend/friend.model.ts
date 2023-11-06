import { OnlineStatus } from 'src/app/models/online-status/online-status';

export class Friend {
  _id?: string;
  username?: string;
  onlineStatus?: OnlineStatus = 'offline';
  isTyping?: boolean = false;

  constructor(friend?: Partial<Friend>) {
    if (friend) {
      this._id = friend._id;
      this.username = friend.username;
      this.onlineStatus = friend.onlineStatus ?? 'offline';
      this.isTyping = friend.isTyping ?? false;
    }
  }
}

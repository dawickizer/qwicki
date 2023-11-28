import { Status } from 'src/app/models/status/status.model';

export class Friend {
  _id?: string;
  username?: string;
  status?: Status = new Status();
  isTyping?: boolean = false;

  constructor(friend?: Partial<Friend>) {
    if (friend) {
      this._id = friend._id;
      this.username = friend.username;
      this.status = friend.status ?? new Status();
      this.isTyping = friend.isTyping ?? false;
    }
  }
}

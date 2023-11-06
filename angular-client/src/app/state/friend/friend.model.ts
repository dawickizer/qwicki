export class Friend {
  _id?: string;
  username?: string;
  online?: boolean = false;
  isTyping?: boolean = false;

  constructor(friend?: Partial<Friend>) {
    if (friend) {
      this._id = friend._id;
      this.username = friend.username;
      this.online = friend.online ?? false;
      this.isTyping = friend.isTyping ?? false;
    }
  }
}

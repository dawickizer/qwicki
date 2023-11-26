import { Notification } from 'src/app/models/notification/notification';
import { Friend } from '../friend/friend.model';

export class Message extends Notification {
  _id?: string;
  content: string;
  viewed: boolean;
  override type: 'message';

  constructor(message?: Partial<Message>) {
    super();
    if (message) {
      this._id = message._id;
      this.createdAt = message.createdAt;
      this.from = new Friend(message.from);
      this.to = new Friend(message.to);
      this.viewed = message.viewed ?? false;
      this.content = message.content ?? '';
      this.type = message.type ?? 'message';
    }
  }
}

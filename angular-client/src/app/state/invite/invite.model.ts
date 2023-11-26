import { Notification } from 'src/app/models/notification/notification';
import { Friend } from '../friend/friend.model';

export class Invite extends Notification {
  _id?: string;
  accepted: boolean;
  override type: 'party';
  roomId: string;
  metadata: any;

  constructor(invite?: Partial<Invite>) {
    super();
    if (invite) {
      this._id = invite._id;
      this.createdAt = invite.createdAt;
      this.from = new Friend(invite.from);
      this.to = new Friend(invite.to);
      this.accepted = invite.accepted ?? false;
      this.type = invite.type;
      this.roomId = invite.roomId;
      this.metadata = invite.metadata;
    }
  }
}

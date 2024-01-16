import { Notification } from 'src/app/models/notification/notification';
import { Friend } from '../friend/friend.model';
import { InviteType } from 'src/app/types/invite-type/invite-type.type';

export class Invite extends Notification {
  accepted: boolean;
  override type: InviteType;
  roomId: string;
  channelId?: string;
  metadata?: any;

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
      this.channelId = invite.channelId;
      this.metadata = invite.metadata;
    }
  }
}

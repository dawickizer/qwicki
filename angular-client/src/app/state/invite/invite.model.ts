import { Friend } from '../friend/friend.model';

export class Invite {
  _id?: string;
  createdAt: Date;
  from: Friend;
  to: Friend;
  accepted: boolean;
  type: 'party';
  roomId: string;
  metadata: any;

  constructor(invite?: Partial<Invite>) {
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

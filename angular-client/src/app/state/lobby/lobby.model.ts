import { Invite } from '../invite/invite.model';
import { Status } from 'src/app/models/status/status.model';
import { Member } from 'src/app/models/member/member';
import { Message } from '../message/message.model';
import { Room } from 'colyseus.js';

export class Lobby {
  _id?: string;
  room: Room;
  status: Status;
  host: Member;
  members: Map<string, Member>;
  messages: Message[];
  outboundInvites: Invite[];

  constructor(lobby?: Partial<Lobby>) {
    if (lobby) {
      this._id = lobby._id;
      this.room = lobby.room;
      this.status = lobby.status;
      this.host = lobby.host;
      this.members = lobby.members;
      this.messages = lobby.messages;
      this.outboundInvites = lobby.outboundInvites;
    }
  }
}

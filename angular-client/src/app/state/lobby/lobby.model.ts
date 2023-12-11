import { Invite } from '../invite/invite.model';
import { Status } from 'src/app/models/status/status.model';
import { Member } from 'src/app/state/lobby/member.model';
import { Room } from 'colyseus.js';
import { LobbyMessage } from './lobby-message.model';

export class Lobby {
  _id?: string;
  room: Room;
  status: Status;
  host: Member;
  members: Map<string, Member>;
  messages: LobbyMessage[];
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

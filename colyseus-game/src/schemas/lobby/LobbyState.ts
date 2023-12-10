import { Schema, type, ArraySchema, MapSchema } from '@colyseus/schema';
import { Status } from './Status';
import { Member } from './Member';
import { Message } from './Message';
import { Invite } from './Invite';

export class LobbyState extends Schema {
  @type('string') _id: string;
  @type(Status) status = new Status();
  @type(Member) host = new Member();
  @type({ map: Member }) members = new MapSchema<Member>();
  @type([Message]) messages = new ArraySchema<Message>();
  @type([Invite]) outboundInvites = new ArraySchema<Invite>();

  constructor(lobbyState?: Partial<LobbyState>) {
    super();
    this._id = lobbyState?._id ?? '';
    this.status = new Status(lobbyState?.status) ?? new Status();
    this.host = new Member(lobbyState?.host) ?? new Member();
    this.members = lobbyState?.members
      ? new MapSchema<Member>(lobbyState?.members)
      : new MapSchema<Member>();
    this.messages = new ArraySchema<Message>(...(lobbyState?.messages ?? []));
    this.outboundInvites = new ArraySchema<Invite>(
      ...(lobbyState?.outboundInvites ?? [])
    );
  }
}

export default LobbyState;

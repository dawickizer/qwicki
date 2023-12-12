import { Schema, type, ArraySchema, MapSchema } from '@colyseus/schema';
import { Status } from './Status';
import { Member } from './Member';
import { Message } from './Message';
import { Invite } from './Invite';
import { Client } from 'colyseus';

export class LobbyState extends Schema {
  @type('string') _id: string;
  @type(Status) status = new Status();
  @type(Member) host = new Member();
  @type({ map: Member }) members = new MapSchema<Member>();
  @type([Message]) messages = new ArraySchema<Message>();
  @type([Invite]) outboundInvites = new ArraySchema<Invite>();

  private availableColors = [
    '#007bff',
    '#BA55D3',
    '#FFD700',
    '#32CD32',
    '#C72929',
  ];
  private colorAssignments = new Map<string, string>();

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

  addMember(member: Member) {
    this.members.set(member.sessionId, member);
    this.assignColor(member.sessionId);
    console.log(`${member.username} joined`);
  }

  deleteMember(member: Member) {
    this.freeUpColor(member.sessionId);
    this.members.delete(member.sessionId);
    console.log(`${member.username} left`);
  }

  getMember(client: Client): Member {
    return this.members.get(client.sessionId);
  }

  getMemberById(id: string) {
    for (const member of this.members.values()) {
      if (member._id === id) {
        return member;
      }
    }
    return null;
  }

  addMessage(message: Message) {
    this.messages.push(message);
  }

  logMembers() {
    console.log('Members in the lobby:');
    this.members.forEach(member => console.log(`${member.username}`));
  }

  assignColor(memberId: string) {
    if (!this.colorAssignments.has(memberId)) {
      const color = this.availableColors.shift() ?? '';
      this.colorAssignments.set(memberId, color);
      this.members.get(memberId).color = color;
    }
  }

  freeUpColor(memberId: string) {
    const color = this.colorAssignments.get(memberId);
    if (color) {
      this.availableColors.push(color);
      this.colorAssignments.delete(memberId);
    }
  }
}

export default LobbyState;

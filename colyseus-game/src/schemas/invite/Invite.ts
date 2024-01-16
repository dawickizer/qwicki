import { Schema, type } from '@colyseus/schema';
import { Member } from '../member/Member';

export class Invite extends Schema {
  @type('string') _id: string;
  @type('number') createdAt: number;
  @type(Member) from: Member;
  @type(Member) to: Member;
  @type('string') roomId: string;
  @type('string') channelId?: string;
  @type('string') metadata?: string;

  constructor(invite?: Partial<Invite>) {
    super();
    this.createdAt = invite?.createdAt ?? Date.now();
    this.from = new Member(invite?.from) ?? new Member();
    this.to = new Member(invite?.to) ?? new Member();
    this.roomId = invite?.roomId;
    this.channelId = invite?.channelId;
    this.metadata = invite?.metadata;
  }
}

import { Schema, type } from '@colyseus/schema';
import { Member } from './Member';

export class Message extends Schema {
  @type('string') _id: string;
  @type('number') createdAt: number;
  @type(Member) from: Member;
  @type('string') to: string;
  @type('string') type: 'lobby-message';
  @type('string') content: string;

  constructor(message?: Partial<Message>) {
    super();
    this._id = message?._id ?? null;
    this.createdAt = message?.createdAt ?? Date.now();
    this.from = new Member(message?.from) ?? new Member();
    this.to = message?.to ?? null;
    this.type = message?.type ?? 'lobby-message';
    this.content = message?.content ?? '';
  }
}

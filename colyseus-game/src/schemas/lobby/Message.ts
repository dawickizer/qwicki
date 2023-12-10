import { Schema, type } from '@colyseus/schema';
import { Member } from './Member';

export class Message extends Schema {
  @type('string') _id: string;
  @type('number') createdAt: number;
  @type(Member) from: Member;
  @type('string') content: string;

  constructor(message?: Partial<Message>) {
    super();
    this.createdAt = message?.createdAt ?? Date.now();
    this.from = new Member(message?.from) ?? new Member();
    this.content = message?.content ?? '';
  }
}

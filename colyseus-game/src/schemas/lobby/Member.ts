import { Schema, type } from '@colyseus/schema';

export class Member extends Schema {
  @type('string') _id: string;
  @type('string') sessionId: string;
  @type('string') username: string;
  @type('boolean') isHost: boolean;

  constructor(member?: Partial<Member>) {
    super();
    this._id = member?._id ?? '';
    this.sessionId = member?.sessionId ?? '';
    this.username = member?.username ?? '';
    this.isHost = member?.isHost ?? false;
  }
}

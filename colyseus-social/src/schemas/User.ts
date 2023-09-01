import { Schema, type } from '@colyseus/schema';

export class User extends Schema {
  @type('string')
  _id: string;

  @type('string')
  sessionId: string;

  @type('string')
  username: string;

  constructor(_id: string, sessionId: string, username: string) {
    super();
    this._id = _id;
    this.sessionId = sessionId;
    this.username = username;
  }
}

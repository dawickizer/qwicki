import { Schema, type } from '@colyseus/schema';
import { OnlineStatus } from '../model/online-status';

export class User extends Schema {
  @type('string')
  _id: string;

  @type('string')
  sessionId: string;

  @type('string')
  username: string;

  @type('string')
  onlineStatus: OnlineStatus;

  constructor(
    _id: string,
    sessionId: string,
    username: string,
    onlineStatus: OnlineStatus
  ) {
    super();
    this._id = _id;
    this.sessionId = sessionId;
    this.username = username;
    this.onlineStatus = onlineStatus ?? 'offline';
  }
}

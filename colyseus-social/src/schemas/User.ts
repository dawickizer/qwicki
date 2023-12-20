import { Schema, type } from '@colyseus/schema';
import { Status } from './Status';

export class User extends Schema {
  @type('string')
  _id: string;

  @type('string')
  sessionId: string;

  @type('string')
  username: string;

  @type(Status)
  status: Status;

  @type('string')
  presence: Presence;

  constructor(user?: Partial<User>) {
    super();
    this._id = user?._id ?? '';
    this.sessionId = user?.sessionId ?? '';
    this.username = user?.username ?? '';
    this.status = user?.status ? new Status(user.status) : new Status();
    this.presence = user.presence ? user.presence : 'Offline';
  }
}

export type Presence = 'Online' | 'Offline' | 'Away';

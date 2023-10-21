import { Schema, type, MapSchema } from '@colyseus/schema';
import { User } from './User';

export class InboxState extends Schema {
  @type(User)
  host: User;

  @type({ map: User })
  users = new MapSchema<User>();
}

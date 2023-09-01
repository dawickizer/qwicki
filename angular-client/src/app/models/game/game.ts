import { User } from '../user/user';
import * as Colyseus from 'colyseus.js';

export class Game {
  _id?: string;
  room?: Colyseus.Room;
  name: string;
  mode = 'Sandbox';
  map = 'Default';
  createdAt: Date;
  createdBy: User;
}

import * as Colyseus from 'colyseus.js';
import { User } from 'src/app/state/user/user.model';

export class Game {
  _id?: string;
  room?: Colyseus.Room;
  name: string;
  mode = 'Sandbox';
  map = 'Default';
  createdAt: Date;
  createdBy: User;
}

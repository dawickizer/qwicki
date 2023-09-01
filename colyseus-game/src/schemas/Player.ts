import { Schema, type } from '@colyseus/schema';
import { Position } from './Position';
import { Rotation } from './Rotation';

export class Player extends Schema {
  @type('string')
  _id: string;

  @type('string')
  sessionId: string;

  @type('string')
  username: string;

  @type(Position)
  position: Position = new Position();

  @type(Rotation)
  rotation: Rotation = new Rotation();

  constructor(_id: string, sessionId: string, username: string) {
    super();
    this._id = _id;
    this.sessionId = sessionId;
    this.username = username;
  }
}

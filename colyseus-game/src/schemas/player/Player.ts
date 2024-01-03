import { Schema, type } from '@colyseus/schema';
import { Position } from '../position/Position';
import { Rotation } from '../rotation/Rotation';

export class Player extends Schema {
  @type('string') _id: string;
  @type('string') sessionId: string;
  @type('string') username: string;
  @type('boolean') isHost: boolean;
  @type('boolean') isReady: boolean;
  @type('string') color: string;
  @type(Position) position: Position = new Position();
  @type(Rotation) rotation: Rotation = new Rotation();

  constructor(player?: Partial<Player>) {
    super();
    this._id = player?._id ?? '';
    this.sessionId = player?.sessionId ?? '';
    this.username = player?.username ?? '';
    this.isHost = player?.isHost ?? false;
    this.isReady = player?.isReady ?? false;
    this.color = player?.color ?? '#FFFFFF';
  }
}

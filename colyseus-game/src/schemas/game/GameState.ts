import { Schema, type, MapSchema } from '@colyseus/schema';
import { Player } from '../player/Player';

export class GameState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
}

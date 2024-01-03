import { Schema, type, MapSchema, ArraySchema } from '@colyseus/schema';
import { Player } from '../player/Player';
import { MaxPlayerCount } from '../../types/max-player-count/max-player-count.type';
import { Message } from '../message/Message';
import { Invite } from '../invite/Invite';
import { TeamName } from '../../types/team-name/team-type.type';

export class Team extends Schema {
  @type('string') _id: string;
  @type('string') name?: TeamName;
  @type('number') maxPlayerCount?: MaxPlayerCount;
  @type('number') score?: number;
  @type({ map: Player }) players = new MapSchema<Player>();
  @type([Message]) messages = new ArraySchema<Message>();
  @type([Invite]) outboundInvites = new ArraySchema<Invite>();
  @type('boolean') isReady: boolean;
}

import { Schema, type, MapSchema, ArraySchema } from '@colyseus/schema';
import { Player } from '../player/Player';
import { MaxPlayerCount } from '../../types/max-player-count/max-player-count.type';
import { Message } from '../message/Message';
import { Invite } from '../invite/Invite';
import { TeamName } from '../../types/team-name/team-name.type';

export class Team extends Schema {
  @type('string') _id: string;
  @type('string') name?: TeamName;
  @type('number') maxPlayerCount?: MaxPlayerCount;
  @type('number') score?: number;
  @type({ map: Player }) players = new MapSchema<Player>();
  @type([Message]) messages = new ArraySchema<Message>();
  @type([Invite]) outboundInvites = new ArraySchema<Invite>();

  constructor(team: Partial<Team>) {
    super();
    this._id = team?._id ?? '';
    this.name = team?.name;
    this.maxPlayerCount = team?.maxPlayerCount;
    this.score = team?.score;
    this.players = team?.players
      ? new MapSchema<Player>(team?.players)
      : new MapSchema<Player>();
    this.messages = new ArraySchema<Message>(...(team?.messages ?? []));
    this.outboundInvites = new ArraySchema<Invite>(
      ...(team?.outboundInvites ?? [])
    );
  }
}

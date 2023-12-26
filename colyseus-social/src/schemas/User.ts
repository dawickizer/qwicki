import { Schema, type } from '@colyseus/schema';
import { Activity } from '../types/activity/activity.type';
import { QueueType } from '../types/queue-type/queue-type.type';
import { GameType } from '../types/game-type/game-type.type';
import { GameMode } from '../types/game-mode/game-mode.type.';
import { GameMap } from '../types/game-map/game-map.type';
import { Presence } from '../types/presence/presence.type';

export class User extends Schema {
  @type('string')
  _id: string;

  @type('string')
  sessionId: string;

  @type('string')
  username: string;

  @type('string')
  activity: Activity;

  @type('string')
  queueType?: QueueType;

  @type('string')
  gameType?: GameType;

  @type('string')
  gameMode?: GameMode;

  @type('string')
  gameMap?: GameMap;

  @type('string')
  presence: Presence;

  constructor(user?: Partial<User>) {
    super();
    this._id = user?._id ?? '';
    this.sessionId = user?.sessionId ?? '';
    this.username = user?.username ?? '';
    this.activity = user?.activity;
    this.queueType = user?.queueType;
    this.gameType = user?.gameType;
    this.gameMode = user?.gameMode;
    this.gameMap = user?.gameMap;
    this.presence = user.presence ? user.presence : 'Offline';
  }
}

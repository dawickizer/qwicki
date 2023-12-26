import { Activity } from 'src/app/types/activity/activity.type';
import { GameMap } from 'src/app/types/game-map/game-map.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { Presence } from 'src/app/types/presence/presence.type';
import { QueueType } from 'src/app/types/queue-type/queue-type.type';

export class Friend {
  _id?: string;
  username?: string;
  presence?: Presence = 'Offline';
  activity?: Activity;
  queueType?: QueueType;
  gameType?: GameType;
  gameMode?: GameMode;
  gameMap?: GameMap;
  isTyping?: boolean = false;

  constructor(friend?: Partial<Friend>) {
    if (friend) {
      this._id = friend._id;
      this.username = friend.username;
      this.presence = friend.presence ?? 'Offline';
      this.activity = friend.activity;
      this.queueType = friend.queueType;
      this.gameType = friend.gameType;
      this.gameMode = friend.gameMode;
      this.gameMap = friend.gameMap;
      this.isTyping = friend.isTyping ?? false;
    }
  }
}

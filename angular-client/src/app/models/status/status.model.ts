import { Activity } from 'src/app/types/activity/activity.type';
import { GameMap } from 'src/app/types/game-map/game-map.type';
import { GameMode } from 'src/app/types/game-mode/game-mode.type.';
import { GameType } from 'src/app/types/game-type/game-type.type';
import { QueueType } from 'src/app/types/queue-type/queue-type.type';

export class Status {
  activity: Activity;
  queueType?: QueueType;
  gameType?: GameType;
  gameMode?: GameMode;
  gameMap?: GameMap;
  metadata?: string;

  constructor(status?: Partial<Status>) {
    if (status) {
      this.activity = status.activity;
      this.queueType = status.queueType;
      this.gameType = status.gameType;
      this.gameMode = status.gameMode;
      this.gameMap = status.gameMap;
      this.metadata = status.metadata;
    }
  }
}

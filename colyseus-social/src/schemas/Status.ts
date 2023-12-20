import { Schema, type } from '@colyseus/schema';

export class Status extends Schema {
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
  metadata?: string;

  constructor(status?: Partial<Status>) {
    super();
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

export type Activity = 'In Lobby' | 'In Queue' | 'In Pregame Lobby' | 'In Game';
export type QueueType = 'Solo' | 'Duo' | 'Squad';
export type GameType = 'Ranked' | 'Normal' | 'Custom' | 'Money Match';
export type GameMode = 'Free For All' | 'Team Deathmatch' | 'Domination';
export type GameMap =
  | 'Fountain Of Dreams'
  | 'Final Destination'
  | 'Yoshi Story';

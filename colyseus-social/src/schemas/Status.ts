import { Schema, type } from '@colyseus/schema';

export class Status extends Schema {
  @type('string')
  presence: Presence;

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
      this.presence = status.presence ?? this.presence;
      this.activity = status.activity ?? this.activity;
      this.queueType = status.queueType ?? this.queueType;
      this.gameType = status.gameType ?? this.gameType;
      this.gameMode = status.gameMode ?? this.gameMode;
      this.gameMap = status.gameMap ?? this.gameMap;
      this.metadata = status.metadata ?? this.metadata;
    }
  }
}

export type Presence = 'Online' | 'Offline' | 'Away';
export type Activity = 'In Lobby' | 'In Queue' | 'In Pregame Lobby' | 'In Game';
export type QueueType = 'Solo' | 'Duo' | 'Squad';
export type GameType = 'Ranked' | 'Normal' | 'Custom' | 'Money Match';
export type GameMode = 'Free For All' | 'Team Deathmatch' | 'Domination';
export type GameMap =
  | 'Fountain Of Dreams'
  | 'Final Destination'
  | 'Yoshi Story';

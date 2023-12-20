import { Schema, type } from '@colyseus/schema';

export class Status extends Schema {
  @type('string') activity?: Activity;
  @type('string') queueType?: QueueType;
  @type('string') gameType?: GameType;
  @type('string') gameMode?: GameMode;
  @type('string') gameMap?: GameMap;
  @type('number') private counter? = 0;

  constructor(status?: Partial<Status>) {
    super();
    this.activity = status?.activity;
    this.queueType = status?.queueType;
    this.gameType = status?.gameType;
    this.gameMode = status?.gameMode;
    this.gameMap = status?.gameMap;

    // A state change wont fire off if all fields are falsy...so always update state via the counter
    this.counter += 1;
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

export class Status {
  presence: Presence = 'Offline';
  activity: Activity;
  queueType?: QueueType;
  gameType?: GameType;
  gameMode?: GameMode;
  gameMap?: GameMap;
  metadata?: string;

  constructor(status?: Partial<Status>) {
    if (status) {
      this.presence = status.presence;
      this.activity = status.activity;
      this.queueType = status.queueType;
      this.gameType = status.gameType;
      this.gameMode = status.gameMode;
      this.gameMap = status.gameMap;
      this.metadata = status.metadata;
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

export const presences: Presence[] = ['Online', 'Offline', 'Away'];
export const activities: Activity[] = [
  'In Lobby',
  'In Queue',
  'In Pregame Lobby',
  'In Game',
];
export const queueTypes: QueueType[] = ['Solo', 'Duo', 'Squad'];
export const gameTypes: GameType[] = [
  'Ranked',
  'Normal',
  'Custom',
  'Money Match',
];
export const gameModes: GameMode[] = [
  'Free For All',
  'Team Deathmatch',
  'Domination',
];
export const gameMaps: GameMap[] = [
  'Fountain Of Dreams',
  'Final Destination',
  'Yoshi Story',
];

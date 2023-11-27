export class Status {
  presence: Presence;
  activity: Activity;
  queueType: QueueType;
  gameType: GameType;
  gameMode: GameMode;
  gameMap: GameMap;
  metadata: string;
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

('In Lobby (Ranked - Solo)');
('Game Mode: Team Deathmatch');
('Map: Fountain of Dreams');

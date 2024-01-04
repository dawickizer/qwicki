export type GameMode =
  | 'Any'
  | 'Free For All'
  | 'Team Deathmatch'
  | 'Domination';

export const gameModes: GameMode[] = [
  'Any',
  'Free For All',
  'Team Deathmatch',
  'Domination',
];

export const gameModesNoAny: GameMode[] = [
  'Free For All',
  'Team Deathmatch',
  'Domination',
];

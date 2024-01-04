export type GameMap = 'Bucheon' | 'Suburbs' | 'Fountain';

export interface MapDetails {
  name: GameMap;
  imagePath: string;
}

export const gameMapDetails: MapDetails[] = [
  { name: 'Bucheon', imagePath: '/assets/maps/bucheon.png' },
  { name: 'Suburbs', imagePath: '/assets/maps/suburbs.png' },
  { name: 'Fountain', imagePath: '/assets/maps/fountain.png' },
];

export const gameMaps = gameMapDetails.map(map => map.name);

export const getMapImage = (mapName: string): string =>
  gameMapDetails.find(map => mapName === map.name).imagePath;

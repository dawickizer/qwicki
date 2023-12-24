export type Visibility =
  | 'Private (Invite Only)'
  | 'Open (Friends Only)'
  | 'Public (Anyone Can Join)';
export const visibilities: Visibility[] = [
  'Private (Invite Only)',
  'Open (Friends Only)',
  'Public (Anyone Can Join)',
];

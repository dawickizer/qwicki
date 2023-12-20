import { Presence } from 'src/app/models/presence/presence';

export interface InactivityState {
  isInactive: boolean;
  isTimedOut: boolean;
  isAway: boolean;
  presence: Presence;
}

export const initialOfflineState: InactivityState = {
  isInactive: false,
  isTimedOut: false,
  isAway: false,
  presence: 'Offline',
};

export const initialOnlineState: InactivityState = {
  isInactive: false,
  isTimedOut: false,
  isAway: false,
  presence: 'Online',
};

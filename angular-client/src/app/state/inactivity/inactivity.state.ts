import { Presence } from 'src/app/types/presence/presence.type';

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
